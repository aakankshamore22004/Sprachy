import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <Logo size="sm" />
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { href: "/about",   label: "About" },
              { href: "/help",    label: "Help" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-medium text-ink-muted transition hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="mailto:aakankshamore22004@gmail.com"
              className="text-xs font-medium text-ink-muted transition hover:text-brand-glow"
            >
              aakankshamore22004@gmail.com
            </a>
          </nav>
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} Aakanksha More
          </p>
        </div>
      </div>
    </footer>
  );
}
