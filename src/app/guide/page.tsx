"use client";

import Link from "next/link";
import guidesData from "@/data/guides.json";

const RELIABILITY_BADGE: Record<string, { label: string; color: string; icon: string }> = {
  confirmed: { label: "검증됨", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: "✓" },
  likely: { label: "높음", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: "~" },
  reference: { label: "참고", color: "bg-slate-500/15 text-slate-400 border-slate-500/30", icon: "?" },
};

const CATEGORY_BADGE: Record<string, string> = {
  orange: "badge-orange",
  blue: "badge-blue",
  purple: "badge-purple",
  red: "badge-red",
  green: "badge-green",
  gold: "badge-gold",
};

// Static tool pages (not from guides.json)
const TOOL_PAGES = [
  {
    href: "/boss",
    icon: "⚔️",
    title: "보스 체크리스트",
    desc: "39종 보스 미션 체크 + 포인트 자동 계산. 시즌3 데이터 기반.",
    category: "도구",
    categoryColor: "badge-blue",
    time: "매주 반복",
    level: "초급",
    reliability: "confirmed" as const,
  },
  {
    href: "/calc",
    icon: "🧮",
    title: "점수 계산기",
    desc: "보스 포인트 + 레벨 미션으로 목표 티어까지 D-day 예측.",
    category: "도구",
    categoryColor: "badge-blue",
    time: "무제한",
    level: "누구나",
    reliability: "confirmed" as const,
  },
  {
    href: "/jobs",
    icon: "🎮",
    title: "직업별 성능 비교",
    desc: "47개 전 직업 5성 평가. 사냥/보스/뉴비적합도 + 점유율 데이터.",
    category: "47직업",
    categoryColor: "badge-purple",
    time: "10분",
    level: "초급",
    reliability: "likely" as const,
  },
  {
    href: "/hunting",
    icon: "🗺️",
    title: "사냥터 가이드",
    desc: "200~300+ 레벨 구간별 17개 사냥터. 아케인/어센틱 포스 요구치.",
    category: "사냥",
    categoryColor: "badge-green",
    time: "6분",
    level: "초급",
    reliability: "likely" as const,
  },
  {
    href: "/defrost",
    icon: "🧊",
    title: "냉동용사 해동 가이드",
    desc: "10년 만에 돌아온 복귀 유저를 위한 6단계 가이드.",
    category: "필독",
    categoryColor: "badge-red",
    time: "5분",
    level: "입문",
    reliability: "likely" as const,
  },
  {
    href: "/glossary",
    icon: "📖",
    title: "은어 사전",
    desc: "아포, 블큐, 코강… 뭔 소리야? 커뮤니티 필수 용어 해설.",
    category: "사전",
    categoryColor: "badge-gold",
    time: "3분",
    level: "입문",
    reliability: "likely" as const,
  },
];

function ReliabilityBadge({ level }: { level: string }) {
  const badge = RELIABILITY_BADGE[level];
  if (!badge) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
      <span>{badge.icon}</span>
      {badge.label}
    </span>
  );
}

export default function GuidePage() {
  const guides = guidesData.guides;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          📚 <span className="gradient-text">챌섭가이드</span>에 오신 걸 환영합니다
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          챌린저스 월드 전용, 실제 데이터 기반 공략 가이드
        </p>
      </div>

      {/* Reliability Legend */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <span className="text-xs text-[var(--text-muted)] mr-2 self-center">신뢰도:</span>
        {Object.entries(RELIABILITY_BADGE).map(([key, badge]) => (
          <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
            <span>{badge.icon}</span>
            {badge.label}
            <span className="text-[var(--text-muted)] ml-1">
              {key === "confirmed" && "3소스+ 검증"}
              {key === "likely" && "2소스 일치"}
              {key === "reference" && "1소스 참고"}
            </span>
          </span>
        ))}
      </div>

      {/* Tools Section */}
      <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
        🛠️ 도구 & 체크리스트
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {TOOL_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="card-hover rounded-2xl bg-[var(--bg-card)] p-6 block"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{page.icon}</span>
              <div className="flex items-center gap-2">
                <ReliabilityBadge level={page.reliability} />
                <span className={`badge ${page.categoryColor}`}>{page.category}</span>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{page.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{page.desc}</p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>⏱️ {page.time}</span>
              <span>📊 {page.level}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Guides Section */}
      <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
        📖 공략 가이드
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guide/${guide.id}`}
            className="card-hover rounded-2xl bg-[var(--bg-card)] p-6 block"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{guide.icon}</span>
              <div className="flex items-center gap-2">
                <ReliabilityBadge level={guide.reliability} />
                <span className={`badge ${CATEGORY_BADGE[guide.categoryColor] || "badge-orange"}`}>
                  {guide.category}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{guide.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{guide.desc}</p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>⏱️ {guide.time}</span>
              <span>📊 {guide.level}</span>
              {guide.sources && (
                <span className="text-[var(--text-muted)]">
                  📋 {guide.sources.length}개 소스
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
