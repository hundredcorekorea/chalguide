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
  return `${d}일 ${h}시간 ${m}분`;
}

const FEATURES = [
  {
    href: "/boss",
    icon: "⚔️",
    title: "보스 체크리스트",
    desc: "주간 보스 클리어 체크 + 결정석 수입 추적",
    badge: "핵심",
    badgeColor: "badge-orange",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    href: "/calc",
    icon: "🧮",
    title: "점수 계산기",
    desc: "목표 티어까지 D-day 예측 + 주간 점수 시뮬레이션",
    badge: "인기",
    badgeColor: "badge-gold",
    gradient: "from-amber-500/20 to-yellow-500/20",
  },
  {
    href: "/quest",
    icon: "📋",
    title: "주간퀘스트 헬퍼",
    desc: "레벨별 해금 콘텐츠 + 공략법 + 유튜브 가이드",
    badge: "매주",
    badgeColor: "badge-blue",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    href: "/jobs",
    icon: "🎮",
    title: "직업 추천",
    desc: "47개 전 직업 5성 평가 + 점유율 데이터 기반",
    badge: "47직업",
    badgeColor: "badge-purple",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    href: "/hunting",
    icon: "🗺️",
    title: "사냥터 가이드",
    desc: "레벨별 추천 사냥터 + 아케인/어센틱 포스 요구치",
    badge: "",
    badgeColor: "",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    href: "/guide",
    icon: "📚",
    title: "전체 가이드",
    desc: "해동 가이드, 은어 사전, 시즌 정보 등 모든 공략",
    badge: "",
    badgeColor: "",
    gradient: "from-slate-500/20 to-slate-400/20",
  },
];

const QUICK_STATS = [
  { label: "보스", value: "26종", icon: "⚔️" },
  { label: "직업", value: "47개", icon: "🎮" },
  { label: "사냥터", value: "12곳", icon: "🗺️" },
  { label: "시즌", value: "S3", icon: "👑" },
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
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          <span className="gradient-text">챌린저스</span> 할 때
          <br />
          제일 먼저 여는 곳
        </h1>
        <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-8 max-w-xl mx-auto">
          보스 체크, 점수 계산, 직업 추천까지
          <br />
          챌린저스 월드 전용 AI 공략 가이드
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 md:gap-10 mb-12">
          {QUICK_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{s.value}</div>
              <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reset Countdown */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)]">
          <span className="text-sm text-[var(--text-secondary)]">⏰ 주간 초기화</span>
          <span className="text-lg font-bold text-[var(--accent-orange)]">{countdown}</span>
          <span className="text-xs text-[var(--text-muted)]">목 00:00 KST</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="pb-12">
        <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-6">
          📊 주요 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`card-hover rounded-2xl bg-[var(--bg-card)] p-6 block`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{f.icon}</span>
                {f.badge && (
                  <span className={`badge ${f.badgeColor}`}>{f.badge}</span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Season Info */}
      <section className="pb-12">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-bold text-lg">시즌 3 CROWN</h3>
              <p className="text-sm text-[var(--text-muted)]">2025.12.18 ~ 2026.04.16</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[var(--text-muted)] text-xs mb-1">티어</div>
              <div className="font-medium">8단계 (브론즈→챌린저)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[var(--text-muted)] text-xs mb-1">최고 점수</div>
              <div className="font-medium">90,000점</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[var(--text-muted)] text-xs mb-1">시즌 보스</div>
              <div className="font-medium">카이</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[var(--text-muted)] text-xs mb-1">초기화</div>
              <div className="font-medium">매주 목요일</div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="pb-24 md:pb-12">
        <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-6">
          🚀 이용 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "01", title: "보스 체크", desc: "매주 잡은 보스를 체크하면 결정석 수입이 자동 계산됩니다" },
            { step: "02", title: "점수 계산", desc: "목표 티어를 설정하면 남은 주수와 필요 점수를 알려줍니다" },
            { step: "03", title: "직업 탐색", desc: "47개 전 직업의 사냥/보스/뉴비 적합도를 비교해보세요" },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
            >
              <div className="text-3xl font-black text-[var(--accent-orange)]/30 mb-2">
                {item.step}
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
