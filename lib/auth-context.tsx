"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  level: "beginner" | "intermediate" | "hard";
  xp: number;
  streak: number;
  lastActive: Date | null;
  photoURL?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Build a minimal profile from Firebase Auth data (fallback if Firestore is unavailable)
function profileFromUser(user: User): UserProfile {
  return {
    uid: user.uid,
    name: user.displayName ?? user.email?.split("@")[0] ?? "Learner",
    email: user.email ?? "",
    level: "beginner",
    xp: 0,
    streak: 0,
    lastActive: null,
    photoURL: user.photoURL ?? undefined,
  };
}

// Try to load / create Firestore profile; falls back gracefully on permission errors
async function ensureProfile(user: User): Promise<UserProfile> {
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const profile = profileFromUser(user);
      // Write — silently ignore if rules block it
      try {
        await setDoc(ref, {
          name: profile.name,
          email: profile.email,
          level: profile.level,
          xp: profile.xp,
          streak: profile.streak,
          photoURL: profile.photoURL ?? null,
          lastActive: serverTimestamp(),
        });
      } catch (writeErr) {
        console.warn("Firestore write blocked (check rules):", writeErr);
      }
      return profile;
    }

    const data = snap.data();
    return {
      uid: user.uid,
      name: data.name ?? profileFromUser(user).name,
      email: data.email ?? user.email ?? "",
      level: data.level ?? "beginner",
      xp: data.xp ?? 0,
      streak: data.streak ?? 0,
      lastActive: data.lastActive?.toDate?.() ?? null,
      photoURL: data.photoURL ?? user.photoURL ?? undefined,
    };
  } catch (err) {
    // Firestore permission error — fall back to Auth-only profile so login still works
    console.warn("Firestore unavailable, using Auth-only profile:", err);
    return profileFromUser(user);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await ensureProfile(firebaseUser);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const p = await ensureProfile(result.user);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail(email: string, password: string) {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const p = await ensureProfile(result.user);
      setProfile(p);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      const p = await ensureProfile({ ...result.user, displayName: name });
      setProfile(p);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  }

  async function updateUserProfile(data: Partial<UserProfile>) {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, data, { merge: true });
    } catch (err) {
      console.warn("Firestore updateUserProfile blocked:", err);
    }
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
