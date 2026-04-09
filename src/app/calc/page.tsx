import Link from "next/link";

const CALCULATORS = [
  {
    href: "/score",
    icon: "🧮",
    title: "점수 계산기",
    desc: "보스 포인트 + 레벨 미션으로 목표 티어까지 D-day 예측",
    badge: "인기",
    badgeColor: "badge-orange",
    available: true,
  },
  {
    href: "#",
    icon: "⭐",
    title: "스타포스 시뮬레이터",
    desc: "2026년 최신 확률 적용, 구간별 기대비용 시뮬레이션",
    badge: "준비중",
    badgeColor: "badge-gold",
    available: false,
  },
  {
    href: "#",
    icon: "📈",
    title: "경험치 계산기",
    desc: "200~300 레벨 구간별 소요 시간 / 물약 계산",
    badge: "준비중",
    badgeColor: "badge-gold",
    available: false,
  },
  {
    href: "#",
    icon: "💰",
    title: "결정석 수입 계산기",
    desc: "주간 보스 클리어 시 결정석 판매 수입 시뮬레이션",
    badge: "준비중",
    badgeColor: "badge-gold",
    available: false,
  },
];

export default function CalcPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          🧮 <span className="gradient-text">계산기</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          시뮬레이션으로 최적의 성장 경로를 찾아보세요
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CALCULATORS.map((calc) => {
          const Wrapper = calc.available ? Link : "div";
          return (
            <Wrapper
              key={calc.title}
              href={calc.href}
              className={`card-hover rounded-2xl bg-[var(--bg-card)] p-8 block ${
                !calc.available ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{calc.icon}</span>
                <span className={`badge ${calc.badgeColor}`}>{calc.badge}</span>
              </div>
              <h3 className="font-bold text-xl mb-2">{calc.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {calc.desc}
              </p>
              {calc.available && (
                <div className="mt-4 text-sm text-[var(--accent-orange)] font-medium">
                  바로가기 →
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
