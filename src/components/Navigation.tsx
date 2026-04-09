"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/guide", label: "가이드", icon: "📚" },
  { href: "/calc", label: "계산기", icon: "🧮", isNew: true },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/jobs", label: "직업", icon: "🎮" },
];

const MOBILE_NAV = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/guide", label: "가이드", icon: "📚" },
  { href: "/calc", label: "계산기", icon: "🧮" },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/jobs", label: "직업", icon: "🎮" },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block sticky top-0 z-50 border-b border-[var(--border)] glass">
        <div className="max-w-6xl mx-auto px-6 flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-xl mr-8 flex items-center gap-2">
            <span className="gradient-text">챌섭가이드</span>
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-[var(--accent-orange)]/10 text-[var(--accent-orange)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
              }`}
            >
              {item.icon} {item.label}
              {item.isNew && (
                <span className="absolute -top-1 -right-1 badge badge-new text-[9px] px-1.5">NEW</span>
              )}
            </Link>
          ))}
          <div className="flex-1" />
          <Link
            href="/"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            🏠 홈으로
          </Link>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] glass safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {MOBILE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                isActive(item.href)
                  ? "text-[var(--accent-orange)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
