"use client";

import { useState, useEffect, useMemo } from "react";
import tierData from "@/data/tiers.json";
import bossData from "@/data/bosses.json";

const tiers = tierData.tiers.filter((t) => t.score > 0);

const TIER_COLORS: Record<string, string> = {
  입문: "#9ca3af",
  일반: "#3b82f6",
  고난이도: "#f97316",
  극한: "#ef4444",
};

const STORAGE_KEY = "chalguide_score_checks";

function getResetTimestamp(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = day >= 4 ? day - 4 : day + 3;
  const lastThursday = new Date(now);
  lastThursday.setDate(now.getDate() - diff);
  lastThursday.setHours(0, 0, 0, 0);
  return lastThursday.getTime();
}

function loadChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.resetAt && saved.resetAt < getResetTimestamp()) return {};
    return saved.checks || {};
  } catch {
    return {};
  }
}

function saveChecks(checks: Record<string, boolean>) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ checks, resetAt: getResetTimestamp() })
  );
}

export default function ScorePage() {
  const [targetTierId, setTargetTierId] = useState("emerald");
  const [extraScore, setExtraScore] = useState(0);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecks(loadChecks());
    setMounted(true);
  }, []);

  const toggleBoss = (id: string) => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    saveChecks(next);
  };

  const bossPoints = useMemo(() => {
    let pts = 0;
    bossData.categories.forEach((cat) => {
      cat.bosses.forEach((boss) => {
        if (checks[boss.id]) pts += boss.points;
      });
    });
    return pts;
  }, [checks]);

  const totalScore = bossPoints + extraScore;
  const targetTier = tiers.find((t) => t.id === targetTierId)!;
  const currentTier = useMemo(() => {
    return [...tiers].reverse().find((t) => totalScore >= t.score) ?? tierData.tiers[0];
  }, [totalScore]);

  const remaining = Math.max(0, targetTier.score - totalScore);
  const progress = targetTier.score > 0 ? Math.min(100, (totalScore / targetTier.score) * 100) : 0;

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const totalBosses = bossData.categories.reduce((a, c) => a + c.bosses.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          🧮 <span className="gradient-text">점수 계산기</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          잡을 수 있는 보스를 체크하면 점수가 자동 계산됩니다.
        </p>
      </div>

      {/* Target + Extra Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">목표 등급</label>
          <select
            value={targetTierId}
            onChange={(e) => setTargetTierId(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 font-bold outline-none focus:border-[var(--accent-orange)]"
          >
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.score.toLocaleString()}점)
              </option>
            ))}
          </select>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">추가 점수 (레벨 미션 등)</label>
          <input
            type="number"
            value={extraScore || ""}
            onChange={(e) => setExtraScore(Number(e.target.value) || 0)}
            placeholder="레벨 미션 포인트 합산"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 font-bold outline-none focus:border-[var(--accent-orange)]"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            레벨 미션(260달성=3,000 등) + 사냥 미션 포인트
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">시뮬레이션 결과</h2>
          <span
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              backgroundColor: `${currentTier.color}20`,
              color: currentTier.color,
            }}
          >
            {mounted ? currentTier.name : "-"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">
              {targetTier.name}까지
            </span>
            <span className="font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: targetTier.color }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">보스 점수</div>
            <div className="text-xl font-bold text-[var(--accent-orange)]">
              {mounted ? bossPoints.toLocaleString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">총 점수</div>
            <div className="text-xl font-bold text-[var(--accent-blue)]">
              {mounted ? totalScore.toLocaleString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">남은 점수</div>
            <div className="text-xl font-bold text-[var(--accent-purple)]">
              {mounted ? remaining.toLocaleString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">체크한 보스</div>
            <div className="text-xl font-bold">
              {mounted ? `${checkedCount}/${totalBosses}` : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Boss Checklist */}
      <h2 className="text-lg font-bold">잡을 수 있는 보스 체크</h2>
      <p className="text-xs text-[var(--text-secondary)] -mt-4">
        매주 잡을 수 있는 보스를 체크하세요. 주간 포인트가 자동 계산됩니다.
      </p>

      {bossData.categories.map((cat) => {
        const tierColor = TIER_COLORS[cat.tier] || "#9ca3af";
        return (
          <div
            key={cat.name}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
          >
            <div
              className="p-3 flex items-center gap-2"
              style={{ borderLeft: `4px solid ${tierColor}` }}
            >
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ color: tierColor, backgroundColor: `${tierColor}20` }}
              >
                {cat.tier}
              </span>
              <span className="font-bold text-sm">{cat.name}</span>
              <span className="text-xs text-[var(--text-secondary)]">
                {cat.description}
              </span>
            </div>

            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {cat.bosses.map((boss) => {
                const checked = mounted && checks[boss.id];
                return (
                  <button
                    key={boss.id}
                    onClick={() => toggleBoss(boss.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      checked
                        ? "bg-[var(--accent-green)]/20 text-[var(--accent-green)]"
                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                        checked
                          ? "border-[var(--accent-green)] bg-[var(--accent-green)] text-white"
                          : "border-[var(--text-secondary)]"
                      }`}
                    >
                      {checked && "✓"}
                    </span>
                    <span className={checked ? "line-through" : ""}>
                      {boss.name} {boss.difficulty}
                    </span>
                    <span className="text-[var(--accent-orange)] font-bold">
                      {boss.points.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Tier Rewards */}
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <h2 className="font-bold text-lg mb-3">티어별 보상</h2>
        <div className="space-y-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                totalScore >= tier.score && mounted
                  ? "bg-[var(--bg-secondary)]"
                  : "bg-[var(--bg-primary)] opacity-60"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: tier.color }}
              />
              <div className="min-w-[80px]">
                <span className="font-bold text-sm" style={{ color: tier.color }}>
                  {tier.name}
                </span>
              </div>
              <div className="text-sm text-[var(--text-secondary)] min-w-[70px]">
                {tier.score.toLocaleString()}점
              </div>
              <div className="text-xs text-[var(--text-secondary)] flex-1">
                {tier.rewards.join(", ")}
              </div>
              {totalScore >= tier.score && mounted && (
                <span className="text-[var(--accent-green)] text-xs font-bold shrink-0">
                  달성
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
