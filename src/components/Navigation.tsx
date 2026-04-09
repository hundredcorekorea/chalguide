"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/guide", label: "가이드", icon: "📚" },
  { href: "/calc", label: "계산기", icon: "🧮", isNew: true },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/jobs", label: "직업", icon: "🎮" },
];

const MOBILE_TAB = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/boss", label: "보스", icon: "⚔️" },
  { href: "/calc", label: "점수", icon: "🧮" },
  { href: "/guide", label: "가이드", icon: "📚" },
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
      <nav className="hidden md:block sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-xl mr-8 text-orange-400 hover:text-orange-300 transition-colors">
            챌섭가이드
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.icon} {item.label}
              {item.isNew && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full">N</span>
              )}
            </Link>
          ))}
          <div className="flex-1" />
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            🏠 홈으로
          </Link>
        </div>
      </nav>

      {/* Mobile bottom tab bar — 앱 스타일 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          {MOBILE_TAB.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform ${
                isActive(item.href) ? "text-orange-400" : "text-slate-500"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
