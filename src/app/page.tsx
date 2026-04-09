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
  { icon: "📊", title: "실시간 보스 체크", desc: "39종 보스 미션 포인트 자동 계산", href: "/boss" },
  { icon: "🎯", title: "점수 시뮬레이션", desc: "목표 티어까지 D-day 예측", href: "/calc" },
  { icon: "🔍", title: "직업 성능 비교", desc: "47개 전 직업 5성 평가 + 점유율", href: "/jobs" },
  { icon: "💎", title: "사냥터 가이드", desc: "레벨별 추천 + 포스 요구치", href: "/hunting" },
  { icon: "🌟", title: "스펙업 로드맵", desc: "장비 성장 10단계 + 큐브 순서", href: "/guide/equipment-progression" },
  { icon: "🔗", title: "신뢰도 검증 시스템", desc: "3소스 교차검증 데이터 기반", href: "/guide" },
];

const STEPS = [
  { num: "01", title: "보스 체크", desc: "매주 잡은 보스를 체크하면 포인트가 자동 계산됩니다" },
  { num: "02", title: "점수 확인", desc: "목표 티어를 설정하면 남은 주수와 필요 점수를 알려줍니다" },
  { num: "03", title: "가이드 참고", desc: "스펙업/직업/사냥터 가이드로 최적 루트를 찾아보세요" },
  { num: "04", title: "신뢰도 확인", desc: "각 정보의 교차검증 수를 확인하고 판단하세요" },
];

const GUIDES = [
  { title: "직업 추천 가이드", desc: "뉴비를 위한 4라인 추천 + 비추 9직업", href: "/guide/job-recommendation", badge: "검증됨" },
  { title: "스타포스 가성비", desc: "17성 국민세팅부터 22성 졸업까지", href: "/guide/starforce-guide", badge: "검증됨" },
  { title: "보스 장비 로드맵", desc: "도전자세트부터 에테르넬까지 10단계", href: "/guide/equipment-progression", badge: "높음" },
  { title: "레벨링 루트", desc: "200~275 최적 육성 루트", href: "/guide/leveling-route", badge: "높음" },
  { title: "헥사 스탯 최적화", desc: "환산 주스탯 구간별 최적 분배", href: "/guide/hexa-stat-guide", badge: "참고" },
  { title: "월드 리프 일정", desc: "놓치면 안 되는 리프 기간 총정리", href: "/guide/world-riff-schedule", badge: "검증됨" },
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
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
          <span className="text-orange-400">챌섭</span>가이드
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
          챌린저스 월드 전용 AI 공략 가이드
          <br />
          <span className="text-slate-500 text-base">시즌 3 CROWN · 교차검증 데이터 기반</span>
        </p>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 sm:gap-10 mb-10">
          {[
            { icon: "⚔️", value: "39종", label: "보스 미션" },
            { icon: "🎮", value: "47개", label: "직업" },
            { icon: "🗺️", value: "17곳", label: "사냥터" },
            { icon: "👑", value: "S3", label: "시즌" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reset Countdown */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-slate-700 bg-slate-800/30">
          <span className="text-sm text-slate-400">⏰ 주간 초기화</span>
          <span className="text-lg font-bold text-orange-400">{countdown}</span>
          <span className="text-xs text-slate-500">목 00:00 KST</span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">주요 기능</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-orange-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/5"
            >
              <span className="text-3xl sm:text-4xl block mb-3 group-hover:scale-110 transition-transform">{f.icon}</span>
              <h3 className="font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">이용 방법</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 sm:p-6"
            >
              <div className="text-3xl font-black text-orange-400/20 mb-2">{step.num}</div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guides (like blog section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">공략 가이드</h2>
          <Link href="/guide" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            전체보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {GUIDES.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700 hover:border-orange-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold group-hover:text-orange-400 transition-colors">{g.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  g.badge === "검증됨" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                  g.badge === "높음" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                  "bg-slate-500/15 text-slate-400 border-slate-500/30"
                }`}>
                  {g.badge === "검증됨" ? "✓" : g.badge === "높음" ? "~" : "?"} {g.badge}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">{g.desc}</p>
              <span className="text-orange-400 text-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                가이드 보기 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Season Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-16">
        <div className="bg-slate-800/30 rounded-2xl p-4 sm:p-8 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-bold text-lg">시즌 3 CROWN</h3>
              <p className="text-sm text-slate-500">2025.12.18 ~ 2026.04.15</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
            {[
              { label: "티어", value: "8단계 (비기너→챌린저)" },
              { label: "보스 미션", value: "101,300pt" },
              { label: "시즌 보스", value: "카이 (노멀/하드)" },
              { label: "초기화", value: "매주 목요일 00:00" },
            ].map((info) => (
              <div key={info.label} className="p-3 rounded-xl bg-slate-900/50">
                <div className="text-slate-500 text-xs mb-1">{info.label}</div>
                <div className="font-medium">{info.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
