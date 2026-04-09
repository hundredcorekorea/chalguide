"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getNextThursday(): Date {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const day = kst.getUTCDay();
  const daysUntil = day >= 4 ? 11 - day : 4 - day;
  const next = new Date(kst);
  next.setUTCDate(kst.getUTCDate() + daysUntil);
  next.setUTCHours(0, 0, 0, 0);
  return new Date(next.getTime() - 9 * 60 * 60 * 1000);
}

function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "초기화됨!";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}일 ${h}시간`;
  return `${h}시간 ${m}분`;
}

const QUICK_ACTIONS = [
  { href: "/boss", icon: "⚔️", label: "보스체크", color: "from-orange-500/20 to-red-500/20" },
  { href: "/calc", icon: "🧮", label: "점수계산", color: "from-blue-500/20 to-cyan-500/20" },
  { href: "/jobs", icon: "🎮", label: "직업추천", color: "from-purple-500/20 to-pink-500/20" },
  { href: "/hunting", icon: "🗺️", label: "사냥터", color: "from-green-500/20 to-emerald-500/20" },
];

const GUIDES = [
  { href: "/guide/job-recommendation", title: "직업 추천", badge: "검증됨", badgeColor: "bg-emerald-500/15 text-emerald-400" },
  { href: "/guide/equipment-progression", title: "장비 로드맵", badge: "높음", badgeColor: "bg-amber-500/15 text-amber-400" },
  { href: "/guide/starforce-guide", title: "스타포스", badge: "검증됨", badgeColor: "bg-emerald-500/15 text-emerald-400" },
  { href: "/guide/leveling-route", title: "레벨링 루트", badge: "높음", badgeColor: "bg-amber-500/15 text-amber-400" },
  { href: "/guide/specup-roadmap", title: "스펙업", badge: "참고", badgeColor: "bg-slate-500/15 text-slate-400" },
  { href: "/guide/world-riff-schedule", title: "리프 일정", badge: "검증됨", badgeColor: "bg-emerald-500/15 text-emerald-400" },
];

export default function Home() {
  const [countdown, setCountdown] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setCountdown(formatCountdown(getNextThursday()));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-slate-950 min-h-screen pb-20 md:pb-0">
      {/* Mobile Header — 앱 스타일 */}
      <div className="px-4 pt-6 pb-4 md:pt-10 md:pb-6 max-w-7xl mx-auto md:px-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl md:text-4xl font-black">
            <span className="text-orange-400">챌섭</span>가이드
          </h1>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">주간 초기화</div>
            <div className="text-sm font-bold text-orange-400">{countdown}</div>
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-500">시즌 3 CROWN · 교차검증 데이터</p>
      </div>

      {/* Quick Actions — 2x2 그리드 (모바일), 4열 (데스크톱) */}
      <div className="px-4 mb-6 max-w-7xl mx-auto md:px-8">
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex flex-col items-center justify-center py-4 md:py-6 rounded-2xl bg-gradient-to-br ${a.color} border border-slate-700/50 active:scale-95 transition-transform`}
            >
              <span className="text-2xl md:text-3xl mb-1">{a.icon}</span>
              <span className="text-xs md:text-sm font-bold">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Season Card */}
      <div className="px-4 mb-6 max-w-7xl mx-auto md:px-8">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">👑</span>
            <div className="flex-1">
              <div className="font-bold text-sm md:text-base">시즌 3 CROWN</div>
              <div className="text-[11px] text-slate-500">2025.12.18 ~ 2026.04.15</div>
            </div>
            <Link href="/guide/world-riff-schedule" className="text-xs text-orange-400 active:text-orange-300">
              리프 일정 →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { v: "101,300", l: "보스 총점" },
              { v: "39종", l: "보스 미션" },
              { v: "카이", l: "시즌 보스" },
            ].map((s) => (
              <div key={s.l} className="bg-slate-900/60 rounded-xl py-2 px-1">
                <div className="text-sm md:text-base font-bold">{s.v}</div>
                <div className="text-[10px] text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide List — 모바일: 풀폭 리스트, 데스크톱: 그리드 */}
      <div className="px-4 mb-6 max-w-7xl mx-auto md:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-400">공략 가이드</h2>
          <Link href="/guide" className="text-xs text-orange-400 active:text-orange-300">전체보기 →</Link>
        </div>

        {/* 모바일: 수평 스크롤 카드 */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible snap-x snap-mandatory">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="flex-shrink-0 w-40 md:w-auto snap-start bg-slate-800/40 border border-slate-700/50 hover:border-orange-500/50 rounded-2xl p-4 active:scale-95 transition-all"
            >
              <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${g.badgeColor}`}>
                {g.badge}
              </div>
              <div className="font-bold text-sm mb-1">{g.title}</div>
              <div className="text-[11px] text-slate-500">가이드 보기 →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* More Tools */}
      <div className="px-4 mb-6 max-w-7xl mx-auto md:px-8">
        <h2 className="text-sm font-bold text-slate-400 mb-3">더보기</h2>
        <div className="space-y-2">
          {[
            { href: "/defrost", icon: "🧊", title: "해동 가이드", desc: "복귀 유저를 위한 6단계" },
            { href: "/quest", icon: "📋", title: "주간퀘스트", desc: "레벨별 해금 콘텐츠 헬퍼" },
            { href: "/glossary", icon: "📖", title: "은어 사전", desc: "아포, 블큐, 코강 뭔 소리?" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-orange-500/50 active:scale-[0.98] transition-all"
            >
              <span className="text-2xl w-10 text-center shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 truncate">{item.desc}</div>
              </div>
              <span className="text-slate-600 text-sm shrink-0">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
