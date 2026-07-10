"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function setAuthCookie() {
    document.cookie = "sprachy-auth=1; path=/; max-age=2592000; SameSite=Lax";
  }

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setBusy(true);
    const form = e.currentTarget;
    const email    = (form.elements.namedItem("email")    as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      await signInWithEmail(email, password);
      setAuthCookie();
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("Incorrect email or password.");
      } else if (msg.includes("user-not-found")) {
        setError("No account with this email. Try signing up.");
      } else { setError(msg); }
    } finally { setBusy(false); }
  }

  async function handleGoogleLogin() {
    setError(""); setBusy(true);
    try {
      await signInWithGoogle();
      setAuthCookie();
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) setError("Google sign-in failed. Try again.");
    } finally { setBusy(false); }
  }

  const isLoading = busy || loading;

  return (
    <div className="w-full max-w-sm animate-fade-rise">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
         
        >
          <span className="text-2xl">🇩🇪</span>
        </div>
        <h1 className="text-2xl font-extrabold text-ink">Willkommen zurück</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Sign in to continue your German journey</p>
      </div>

      <div className="card p-6">
        {error && (
          <div className="mb-4 rounded-btn border border-error/30 bg-error-soft px-3 py-2.5 text-sm text-error">
            {error}
          </div>
        )}

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="mb-4 flex w-full items-center justify-center gap-2.5 rounded-btn border bg-surface py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2 disabled:opacity-50"
         
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="mb-4 flex items-center gap-3">
          <hr className="flex-1" />
          <span className="text-xs text-ink-muted">or email</span>
          <hr className="flex-1" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-muted">
              Email address
            </label>
            <input id="email" type="email" name="email" placeholder="you@example.com" className="input" required disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-ink-muted">
              Password
            </label>
            <div className="relative">
              <input
                id="password" type={showPw ? "text" : "password"} name="password"
                placeholder="••••••••" className="input pr-10" required disabled={isLoading}
              />
              <button
                type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition hover:text-ink"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
              <input type="checkbox" className="accent-brand" />
              Remember me
            </label>
            <button type="button" className="text-xs font-medium text-brand-glow hover:underline">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary w-full py-2.5" disabled={isLoading}>
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-ink-muted">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-brand-glow hover:underline">
          Sign up free →
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[90dvh] items-center justify-center px-4">
      <Suspense fallback={<Loader2 size={24} className="animate-spin text-brand" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
