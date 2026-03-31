"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mobile bottom nav — 5 tabs only
const MOBILE_NAV = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/score", label: "점수", icon: "🧮" },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/quest", label: "퀘스트", icon: "📋" },
  { href: "/jobs", label: "직업", icon: "🎮" },
];

// Desktop top nav — all pages
const NAV_ITEMS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/score", label: "점수계산", icon: "🧮" },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/quest", label: "퀘스트", icon: "📋" },
  { href: "/jobs", label: "직업추천", icon: "🎮" },
  { href: "/hunting", label: "사냥터", icon: "🗺️" },
  { href: "/defrost", label: "해동", icon: "🧊" },
  { href: "/glossary", label: "은어사전", icon: "📖" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:block sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-lg mr-6 text-[var(--accent-orange)]">
            챌섭가이드
          </Link>
          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-[var(--accent-orange)]/15 text-[var(--accent-orange)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {MOBILE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                pathname === item.href
                  ? "text-[var(--accent-orange)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
