"use client";

import Link from "next/link";
import guidesData from "@/data/guides.json";

const RELIABILITY: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  confirmed: { label: "검증됨", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", icon: "✓", desc: "3개 이상 소스에서 교차검증" },
  likely: { label: "높음", color: "text-amber-400 bg-amber-500/15 border-amber-500/30", icon: "~", desc: "2개 소스에서 일치" },
  reference: { label: "참고", color: "text-slate-400 bg-slate-500/15 border-slate-500/30", icon: "?", desc: "1개 소스. 피드백 보정 필요" },
};

function ReliabilityTag({ level, sources }: { level: string; sources?: string[] }) {
  const r = RELIABILITY[level];
  if (!r) return null;
  return (
    <div className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${r.color}`}>
      <span className="font-bold">{r.icon} {r.label}</span>
      <span className="text-[var(--text-muted)]">{r.desc}</span>
      {sources && sources.length > 0 && (
        <span className="text-[var(--text-muted)] border-l border-current/20 pl-2 ml-1">
          {sources.join(", ")}
        </span>
      )}
    </div>
  );
}

type Section = {
  title: string;
  reliability?: string;
  sources?: string[];
  content?: string;
  steps?: Array<Record<string, string | number>>;
  items?: Array<Record<string, string>>;
  specs?: Array<Record<string, string>>;
  tiers?: Array<Record<string, string>>;
  budgets?: Array<Record<string, string>>;
  lines?: Array<{ name: string; jobs: string[] }>;
  recommendations?: Array<{ job: string; reason: string; tags: string[] }>;
  avoid?: Array<{ job: string; reason: string }>;
  bosses?: Array<{ boss: string; difficulty: string; drops: string[]; why: string }>;
  schedule?: Array<{ phase: string; period: string; note: string }>;
  options?: Array<{ name: string; desc: string }>;
};

function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="font-bold text-lg">{section.title}</h3>
        {section.reliability && (
          <ReliabilityTag level={section.reliability} sources={section.sources} />
        )}
      </div>

      {section.content && (
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{section.content}</p>
      )}

      {section.steps && (
        <div className="space-y-3">
          {section.steps.map((step, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5">
              <div className="text-2xl font-black text-[var(--accent-orange)]/30 shrink-0 w-8 text-center">
                {step.stage || step.rank || (i + 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{step.name || step.target || step.level}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">{step.desc || step.method || step.strategy}</div>
                {step.goal && <div className="text-xs text-[var(--accent-orange)] mt-1">목표: {step.goal}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.items && (
        <div className="space-y-2">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm">
              <span className="font-medium">{item.item}</span>
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                {item.cost && <span>{item.cost}</span>}
                {item.source && <span>{item.source}</span>}
                {item.priority && (
                  <span className={`badge ${item.priority === "최우선" ? "badge-orange" : item.priority === "높음" ? "badge-blue" : "badge-gold"}`}>
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.specs && (
        <div className="grid grid-cols-2 gap-3">
          {section.specs.map((spec, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5">
              <div className="text-xs text-[var(--text-muted)]">{spec["항목"]}</div>
              <div className="font-bold text-sm mt-0.5">{spec["목표"]}</div>
            </div>
          ))}
        </div>
      )}

      {section.tiers && (
        <div className="space-y-2">
          {section.tiers.map((tier, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/5 text-sm">
              <span className="font-bold text-[var(--accent-orange)] min-w-[80px]">{tier.stars || tier.range}</span>
              {tier.rating && (
                <span className={`badge ${
                  tier.rating === "국민세팅" ? "badge-green" :
                  tier.rating === "졸업" ? "badge-blue" :
                  tier.rating === "함정" ? "badge-red" :
                  tier.rating === "신화" ? "badge-purple" : "badge-gold"
                }`}>{tier.rating}</span>
              )}
              <span className="text-[var(--text-secondary)] flex-1">
                {tier.desc || ""}
                {tier.main && <>메인: <strong>{tier.main}</strong></>}
                {tier.additional && <> / 에디: <strong>{tier.additional}</strong></>}
              </span>
            </div>
          ))}
        </div>
      )}

      {section.budgets && (
        <div className="space-y-2">
          {section.budgets.map((b, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 text-sm">
              <span className="font-bold text-[var(--accent-orange)]">{b.tier}</span>
              <span className="text-[var(--text-secondary)] ml-2">{b.strategy}</span>
            </div>
          ))}
        </div>
      )}

      {section.lines && (
        <div className="space-y-4">
          {section.lines.map((line, i) => (
            <div key={i}>
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">{line.name}</div>
              <div className="flex flex-wrap gap-2">
                {line.jobs.map((job) => (
                  <span key={job} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm font-medium border border-[var(--border)]">{job}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.recommendations && (
        <div className="space-y-3">
          {section.recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border-l-2 border-[var(--accent-orange)]">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-black text-lg text-[var(--accent-orange)]">#{i + 1}</span>
                <span className="font-bold">{rec.job}</span>
                {rec.tags?.map((tag) => (
                  <span key={tag} className={`badge ${tag === "뉴비추천" ? "badge-green" : tag === "보스형" ? "badge-red" : tag === "사냥형" ? "badge-blue" : "badge-purple"}`}>{tag}</span>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}

      {section.avoid && (
        <div className="space-y-2">
          {section.avoid.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm">
              <span className="text-red-400 shrink-0">✕</span>
              <div>
                <span className="font-bold">{item.job}</span>
                <span className="text-[var(--text-secondary)] ml-2">{item.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {section.bosses && (
        <div className="space-y-3">
          {section.bosses.map((boss, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">{boss.boss}</span>
                <span className="badge badge-red">{boss.difficulty}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-2">{boss.why}</p>
              <div className="flex flex-wrap gap-1.5">
                {boss.drops.map((drop) => (
                  <span key={drop} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">{drop}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.schedule && (
        <div className="space-y-2">
          {section.schedule.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/5 text-sm">
              <span className="font-bold">{item.phase}</span>
              <span className="text-[var(--text-secondary)]">{item.period}</span>
              {item.note && <span className="text-xs text-[var(--accent-orange)]">{item.note}</span>}
            </div>
          ))}
        </div>
      )}

      {section.options && (
        <div className="space-y-2">
          {section.options.map((opt, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5">
              <div className="font-bold text-sm mb-1">
                {i === section.options!.length - 1 && <span className="text-[var(--accent-orange)] mr-1">추천</span>}
                {opt.name}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{opt.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuideDetailClient({ id }: { id: string }) {
  const guide = guidesData.guides.find((g) => g.id === id);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">가이드를 찾을 수 없습니다</h1>
        <Link href="/guide" className="text-[var(--accent-orange)] underline">가이드 목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
        ← 가이드 목록
      </Link>

      <div className="mb-8">
        <div className="flex items-start gap-4 mb-3">
          <span className="text-4xl">{guide.icon}</span>
          <div>
            <h1 className="text-3xl font-black">{guide.title}</h1>
            <p className="text-[var(--text-secondary)] mt-1">{guide.desc}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <ReliabilityTag level={guide.reliability} sources={guide.sources} />
          <span className="text-xs text-[var(--text-muted)]">⏱️ {guide.time}</span>
          <span className="text-xs text-[var(--text-muted)]">📊 {guide.level}</span>
        </div>
      </div>

      <div className="space-y-6">
        {guide.sections.map((section, i) => (
          <SectionBlock key={i} section={section as Section} />
        ))}
      </div>

      <div className="mt-10 p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] text-center text-sm text-[var(--text-muted)]">
        정보가 틀렸나요? 알려주시면 바로 수정합니다.
      </div>
    </div>
  );
}
