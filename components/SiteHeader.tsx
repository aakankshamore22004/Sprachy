"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    document.cookie = "sprachy-auth=; path=/; max-age=0";
    router.push("/");
    setOpen(false);
  }

  const authedLinks = [
    { href: "/dashboard",  label: "Dashboard" },
    { href: "/practice", label: "Practice" },
    { href: "/writing",    label: "Writing" },
    { href: "/quizzes",    label: "Quizzes" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/progress",   label: "Progress" },
  ];
  const guestLinks = [
    { href: "/about",   label: "About" },
    { href: "/help",    label: "Help" },
    { href: "/contact", label: "Contact" },
  ];
  const navLinks = user ? authedLinks : guestLinks;

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-btn px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-brand-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-btn border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-brand/40 hover:text-ink"
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="avatar" className="h-5 w-5 rounded-full object-cover ring-1 ring-brand/40" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {(profile?.name?.[0] ?? "?").toUpperCase()}
                  </div>
                )}
                <span>{profile?.name?.split(" ")[0] ?? "Account"}</span>
                <ChevronDown size={12} className="opacity-50" />
              </Link>
              <button
                onClick={handleSignOut}
                className="flex h-8 w-8 items-center justify-center rounded-btn border border-line text-ink-muted transition hover:border-error/30 hover:bg-error-soft hover:text-error"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink-muted transition hover:text-ink px-3 py-1.5">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-4 py-2">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-btn border border-line text-ink-muted sm:hidden transition hover:border-brand/40 hover:text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="sm:hidden animate-fade-rise px-4 pb-4 pt-2 border-t border-line"
        >
          <nav className="flex flex-col gap-0.5 mb-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-btn px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-brand-soft hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-3 border-t border-line">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-btn border border-line bg-surface px-3 py-2.5 text-sm font-medium text-ink"
                >
                  <User size={14} className="text-brand" />
                  {profile?.name ?? "Profile"}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-btn border border-error/20 bg-error-soft px-3 py-2.5 text-sm font-medium text-error"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost w-full">Sign in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
