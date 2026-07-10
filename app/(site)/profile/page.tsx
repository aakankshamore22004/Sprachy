"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Save, LogOut, User } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, loading, signOut, updateUserProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"beginner"|"intermediate"|"hard">("beginner");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (profile) { setName(profile.name ?? ""); setLevel(profile.level ?? "beginner"); }
  }, [loading, user, profile, router]);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await updateUserProfile({ name, level });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  async function handleSignOut() {
    await signOut();
    document.cookie = "sprachy-auth=; path=/; max-age=0";
    router.push("/");
  }

  if (loading || !profile) return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <Loader2 size={24} className="animate-spin text-brand" />
    </div>
  );

  const initials = (profile.name ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-sm px-4 py-8 space-y-5 animate-fade-rise">
      <div className="text-center">
        <div className="chip mx-auto mb-3">👤 Profile</div>
        <h1 className="text-2xl font-extrabold text-ink">Your Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        {profile.photoURL ? (
          <img
            src={profile.photoURL} alt="avatar"
            className="h-20 w-20 rounded-full object-cover ring-2 ring-brand"
           
          />
        ) : (
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-extrabold text-white bg-brand"
          >
            {initials}
          </div>
        )}
        <div className="text-center">
          <p className="font-bold text-ink">{profile.name}</p>
          <p className="text-xs text-ink-muted">{profile.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Edit Profile</p>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">German Level</label>
          <div className="grid grid-cols-3 gap-2">
            {(["beginner","intermediate","hard"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className="rounded-btn py-2 text-xs font-semibold transition"
                style={level === l
                  ? { background: "#16140F", border: "1px solid #16140F", color: "#FFFFFF" }
                  : { background: "#EFEAE0", border: "1px solid #E7E1D6", color: "#6B6256" }
                }
              >
                {l === "beginner" ? "A1–A2" : l === "intermediate" ? "A2–B1" : "B2–C1"}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[10px] text-ink-muted">
            {level === "beginner" ? "Beginner" : level === "intermediate" ? "Intermediate" : "Advanced"}
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      {/* Stats */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Your Stats</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { val: `${profile.xp ?? 0}`, label: "XP" },
            { val: `${profile.streak ?? 0}d`, label: "Streak" },
            { val: profile.level === "beginner" ? "A1" : profile.level === "intermediate" ? "B1" : "C1", label: "CEFR" },
          ].map(({ val, label }) => (
            <div key={label} className="rounded-btn py-2.5">
              <p className="text-lg font-extrabold gradient-text">{val}</p>
              <p className="text-[10px] text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex w-full items-center justify-center gap-2 rounded-btn border border-error/30 py-3 text-sm font-semibold text-error transition hover:bg-error-soft"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}
