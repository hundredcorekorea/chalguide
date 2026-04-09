"use client";

import Link from "next/link";
import guidesData from "@/data/guides.json";

const RELIABILITY_BADGE: Record<string, { label: string; color: string; icon: string }> = {
  confirmed: { label: "검증됨", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: "✓" },
  likely: { label: "높음", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: "~" },
  reference: { label: "참고", color: "bg-slate-500/15 text-slate-400 border-slate-500/30", icon: "?" },
};

const TOOL_PAGES = [
  { href: "/boss", icon: "⚔️", title: "보스 체크리스트", desc: "39종 보스 미션 체크 + 포인트 자동 계산", time: "매주", level: "초급", reliability: "confirmed", category: "도구" },
  { href: "/calc", icon: "🧮", title: "점수 계산기", desc: "목표 티어까지 D-day 예측 시뮬레이션", time: "무제한", level: "누구나", reliability: "confirmed", category: "도구" },
  { href: "/jobs", icon: "🎮", title: "직업별 성능 비교", desc: "47개 전 직업 5성 평가 + 점유율 데이터", time: "10분", level: "초급", reliability: "likely", category: "47직업" },
  { href: "/hunting", icon: "🗺️", title: "사냥터 가이드", desc: "200~300+ 레벨 구간별 17개 사냥터", time: "6분", level: "초급", reliability: "likely", category: "사냥" },
  { href: "/defrost", icon: "🧊", title: "냉동용사 해동 가이드", desc: "복귀 유저를 위한 6단계 가이드", time: "5분", level: "입문", reliability: "likely", category: "필독" },
  { href: "/glossary", icon: "📖", title: "은어 사전", desc: "커뮤니티 필수 용어 해설", time: "3분", level: "입문", reliability: "likely", category: "사전" },
];

export default function GuidePage() {
  const guides = guidesData.guides;

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">

        {/* Header */}
        <div className="bg-slate-800/30 rounded-2xl p-4 sm:p-8 border border-slate-700 mb-8 sm:mb-12">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📚</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2">
                <span className="text-orange-400">챌섭가이드</span>에 오신 걸 환영합니다
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                챌린저스 월드 전용, 실제 데이터 기반 공략 가이드. 각 정보의 교차검증 수준을 확인하세요.
              </p>
            </div>
          </div>

          {/* Reliability Legend */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
            <span className="text-xs text-slate-500 self-center mr-1">신뢰도:</span>
            {Object.entries(RELIABILITY_BADGE).map(([key, badge]) => (
              <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${badge.color}`}>
                {badge.icon} {badge.label}
                <span className="text-slate-500 ml-1 hidden sm:inline">
                  {key === "confirmed" ? "3소스+" : key === "likely" ? "2소스" : "1소스"}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">도구 & 체크리스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {TOOL_PAGES.map((page) => {
            const r = RELIABILITY_BADGE[page.reliability];
            return (
              <Link
                key={page.href}
                href={page.href}
                className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-orange-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-200 shadow-lg hover:shadow-orange-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">{page.icon}</span>
                  <div className="flex items-center gap-2">
                    {r && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${r.color}`}>
                        {r.icon} {r.label}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-slate-700 text-slate-300 text-[10px] sm:text-xs rounded-full font-medium">
                      {page.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold group-hover:text-orange-400 transition-colors mb-1">{page.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{page.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>⏱️ {page.time}</span>
                    <span>📊 {page.level}</span>
                  </div>
                  <span className="text-orange-400 text-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    바로가기 →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Guides */}
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">공략 가이드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {guides.map((guide) => {
            const r = RELIABILITY_BADGE[guide.reliability];
            return (
              <Link
                key={guide.id}
                href={`/guide/${guide.id}`}
                className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-orange-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-200 shadow-lg hover:shadow-orange-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">{guide.icon}</span>
                  <div className="flex items-center gap-2">
                    {r && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${r.color}`}>
                        {r.icon} {r.label}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-slate-700 text-slate-300 text-[10px] sm:text-xs rounded-full font-medium">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold group-hover:text-orange-400 transition-colors mb-1">{guide.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{guide.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>⏱️ {guide.time}</span>
                    <span>📊 {guide.level}</span>
                    <span>📋 {guide.sources.length}소스</span>
                  </div>
                  <span className="text-orange-400 text-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    가이드 보기 →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-8 sm:mt-12 bg-slate-800/20 border border-slate-700 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-2xl mb-3">🚧</p>
          <p className="text-slate-400 font-medium">더 많은 가이드가 준비 중입니다</p>
          <p className="text-sm text-slate-500 mt-1">스타포스 시뮬레이터, 경험치 계산기, 코어 강화 가이드 등</p>
        </div>
      </div>
    </div>
  );
}
