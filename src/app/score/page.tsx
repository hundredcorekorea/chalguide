"use client";

import { useState, useMemo } from "react";
import tierData from "@/data/tiers.json";

const tiers = tierData.tiers.filter((t) => t.score > 0);

export default function ScorePage() {
  const [currentScore, setCurrentScore] = useState(0);
  const [targetTierId, setTargetTierId] = useState("emerald");
  const [dailyPoints, setDailyPoints] = useState(1500);

  const targetTier = tiers.find((t) => t.id === targetTierId)!;
  const currentTier = useMemo(() => {
    return [...tiers].reverse().find((t) => currentScore >= t.score) ?? tierData.tiers[0];
  }, [currentScore]);

  const remaining = Math.max(0, targetTier.score - currentScore);
  const daysNeeded = dailyPoints > 0 ? Math.ceil(remaining / dailyPoints) : Infinity;
  const progress = targetTier.score > 0 ? Math.min(100, (currentScore / targetTier.score) * 100) : 0;

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">점수 계산기</h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">현재 점수</label>
          <input
            type="number"
            value={currentScore || ""}
            onChange={(e) => setCurrentScore(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-bold outline-none focus:border-[var(--accent-orange)]"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            현재 등급:{" "}
            <span style={{ color: currentTier.color }} className="font-bold">
              {currentTier.name}
            </span>
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">목표 등급</label>
          <select
            value={targetTierId}
            onChange={(e) => setTargetTierId(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-bold outline-none focus:border-[var(--accent-orange)]"
          >
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.score.toLocaleString()}점)
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">일일 예상 획득 점수</label>
          <input
            type="number"
            value={dailyPoints || ""}
            onChange={(e) => setDailyPoints(Number(e.target.value))}
            placeholder="1500"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-bold outline-none focus:border-[var(--accent-orange)]"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            사냥+보스 합산 일일 포인트
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">시뮬레이션 결과</h2>
          <span
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{
              backgroundColor: `${targetTier.color}20`,
              color: targetTier.color,
            }}
          >
            {targetTier.name}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">진행도</span>
            <span className="font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: targetTier.color,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>{currentScore.toLocaleString()}점</span>
            <span>{targetTier.score.toLocaleString()}점</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">남은 점수</div>
            <div className="text-xl font-bold text-[var(--accent-orange)]">
              {remaining.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">예상 소요일</div>
            <div className="text-xl font-bold text-[var(--accent-blue)]">
              {daysNeeded === Infinity ? "-" : `${daysNeeded}일`}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">예상 달성일</div>
            <div className="text-sm font-bold text-[var(--accent-green)]">
              {daysNeeded === Infinity
                ? "-"
                : new Date(Date.now() + daysNeeded * 86400000)
                    .toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-center">
            <div className="text-xs text-[var(--text-secondary)]">일일 획득</div>
            <div className="text-xl font-bold">{dailyPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Tier Table */}
      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <h2 className="font-bold text-lg mb-3">티어별 보상</h2>
        <div className="space-y-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                currentScore >= tier.score
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
              {currentScore >= tier.score && (
                <span className="text-[var(--accent-green)] text-xs font-bold shrink-0">달성</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
