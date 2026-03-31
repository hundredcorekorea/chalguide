"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MODE_KEY = "chalguide_mode";

function getNextThursday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilThursday = day >= 4 ? 11 - day : 4 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilThursday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatCountdown(target: Date): string {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "초기화됨!";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}일 ${hours}시간`;
}

const FEATURES = [
  { href: "/score", icon: "🧮", title: "점수 계산기", desc: "목표 티어 D-day 예측", color: "var(--accent-orange)" },
  { href: "/boss", icon: "⚔️", title: "보스 체크", desc: "주간 보스 체크 + 드롭 공략", color: "var(--accent-blue)" },
  { href: "/quest", icon: "📋", title: "주간퀘스트", desc: "헬퍼 + 공략법", color: "var(--accent-purple)" },
  { href: "/jobs", icon: "🎮", title: "직업 추천", desc: "47개 전 직업 별점", color: "var(--accent-gold)" },
  { href: "/hunting", icon: "🗺️", title: "사냥터", desc: "레벨별 추천 사냥터", color: "var(--accent-green)" },
  { href: "/defrost", icon: "🧊", title: "해동 가이드", desc: "10년 만에 복귀?", color: "#7dd3fc" },
  { href: "/glossary", icon: "📖", title: "은어 사전", desc: "아포? 블큐? 뭔소리야", color: "#9ca3af" },
];

export default function Home() {
  const [mode, setMode] = useState<"none" | "veteran" | "newbie">("none");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "veteran" || saved === "newbie") setMode(saved);
    setMounted(true);
  }, []);

  const selectMode = (m: "none" | "veteran" | "newbie") => {
    setMode(m);
    if (m === "none") localStorage.removeItem(MODE_KEY);
    else localStorage.setItem(MODE_KEY, m);
  };

  if (!mounted) return null;

  // First visit — mode selection
  if (mode === "none") {
    return (
      <div className="py-16 space-y-8 max-w-md mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            <span className="text-[var(--accent-orange)]">챌섭</span>가이드
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            챌린저스 할 때 제일 먼저 여는 곳
          </p>
        </div>

        <button
          onClick={() => selectMode("veteran")}
          className="w-full p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors text-left"
        >
          <div className="text-2xl mb-2">🎮</div>
          <div className="font-bold text-lg">익숙해요</div>
          <div className="text-sm text-[var(--text-secondary)]">
            대시보드 + 계산기 바로가기
          </div>
        </button>

        <button
          onClick={() => selectMode("newbie")}
          className="w-full p-6 rounded-xl border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/5 hover:bg-[var(--accent-blue)]/10 transition-colors text-left"
        >
          <div className="text-2xl mb-2">🧊</div>
          <div className="font-bold text-lg">뉴비에요</div>
          <div className="text-sm text-[var(--text-secondary)]">
            챌린저스가 처음이거나, 오랜만에 돌아왔어요
          </div>
        </button>

        <p className="text-center text-xs text-[var(--text-secondary)]">
          언제든 설정에서 전환 가능
        </p>
      </div>
    );
  }

  // Newbie → redirect to defrost
  if (mode === "newbie") {
    return (
      <div className="py-8 space-y-6">
        <div className="p-5 rounded-xl border-2 border-[var(--accent-blue)] bg-[var(--accent-blue)]/5 text-center">
          <div className="text-3xl mb-3">🧊</div>
          <h2 className="text-lg font-bold mb-2">해동 가이드를 시작합니다</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            챌린저스가 처음이시군요. 차근차근 알려드릴게요.
          </p>
          <Link
            href="/defrost"
            className="inline-block px-6 py-2.5 rounded-lg bg-[var(--accent-blue)] text-white font-bold text-sm"
          >
            해동 시작하기 →
          </Link>
        </div>

        <div className="text-center">
          <button
            onClick={() => selectMode("veteran")}
            className="text-xs text-[var(--text-secondary)] underline"
          >
            숙련자 모드로 전환
          </button>
        </div>

        <h3 className="text-sm font-bold text-[var(--text-secondary)]">
          전체 기능
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-bold text-sm" style={{ color: f.color }}>
                {f.title}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {f.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Veteran dashboard
  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-[var(--accent-orange)]">챌섭</span>가이드
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            시즌 3 CROWN
          </p>
        </div>
        <button
          onClick={() => selectMode("none")}
          className="text-xs text-[var(--text-secondary)] px-2 py-1 rounded border border-[var(--border)]"
        >
          모드 전환
        </button>
      </div>

      {/* Reset Countdown */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">
              주간 초기화까지
            </div>
            <div className="text-xl font-bold text-[var(--accent-orange)]">
              {formatCountdown(getNextThursday())}
            </div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] text-right">
            매주 목요일<br />자정 (KST)
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-bold text-sm" style={{ color: f.color }}>
              {f.title}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {f.desc}
            </div>
          </Link>
        ))}
      </div>

      {/* Season Info */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <h2 className="font-bold text-sm mb-2">이번 시즌</h2>
        <div className="text-xs text-[var(--text-secondary)] space-y-1">
          <div>시즌 3 CROWN | 2025.12.18 ~ 2026.04.16</div>
          <div>8단계 티어: 브론즈(5천) → 챌린저(9만)</div>
          <div>시즌 보스: 카이 (마스터=노멀, 챌린저=하드 처치 필수)</div>
        </div>
      </div>
    </div>
  );
}
