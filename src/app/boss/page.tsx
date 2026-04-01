"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import bossData from "@/data/bosses.json";
import bossImages from "@/data/bossImages.json";

const TIER_COLORS: Record<string, string> = {
  납별: "#9ca3af",
  동별: "#cd7f32",
  은별: "#c0c0c0",
  금별: "#ffd700",
};

const STORAGE_KEY = "chalguide_boss_checks";

function getResetTimestamp(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = day >= 4 ? day - 4 : day + 3;
  const lastThursday = new Date(now);
  lastThursday.setDate(now.getDate() - diff);
  lastThursday.setHours(0, 0, 0, 0);
  return lastThursday.getTime();
}

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
  if (diff <= 0) return "초기화됨";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}일 ${hours}시간`;
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

type CategoryFilter = "all" | "입문" | "일반" | "고난이도" | "극한";

export default function BossPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [expandedBoss, setExpandedBoss] = useState<string | null>(null);

  useEffect(() => {
    setChecks(loadChecks());
    setMounted(true);
  }, []);

  const toggleBoss = (id: string) => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    saveChecks(next);
  };

  const filteredCategories = useMemo(() => {
    if (filter === "all") return bossData.categories;
    return bossData.categories.filter((c) => c.name === filter);
  }, [filter]);

  const totalChecked = useMemo(() => {
    return Object.values(checks).filter(Boolean).length;
  }, [checks]);

  const totalBosses = useMemo(() => {
    return bossData.categories.reduce((acc, c) => acc + c.bosses.length, 0);
  }, []);

  const totalPoints = useMemo(() => {
    let pts = 0;
    bossData.categories.forEach((cat) => {
      cat.bosses.forEach((boss) => {
        if (checks[boss.id]) pts += boss.points;
      });
    });
    return pts;
  }, [checks]);

  const filters: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "전체" },
    { id: "입문", label: "입문" },
    { id: "일반", label: "일반" },
    { id: "고난이도", label: "고난이도" },
    { id: "극한", label: "극한" },
  ];

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">보스 체크리스트</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center">
          <div className="text-xs text-[var(--text-secondary)]">처치</div>
          <div className="text-2xl font-bold text-[var(--accent-orange)]">
            {mounted ? `${totalChecked}/${totalBosses}` : "-"}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center">
          <div className="text-xs text-[var(--text-secondary)]">획득 포인트</div>
          <div className="text-2xl font-bold text-[var(--accent-blue)]">
            {mounted ? totalPoints.toLocaleString() : "-"}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-center">
          <div className="text-xs text-[var(--text-secondary)]">초기화까지</div>
          <div className="text-sm font-bold text-[var(--accent-green)]">
            {mounted ? formatCountdown(getNextThursday()) : "-"}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-[var(--accent-orange)] text-white"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Boss Categories */}
      {filteredCategories.map((cat) => {
        const tierColor = TIER_COLORS[cat.tier] || "#9ca3af";
        const catPoints = cat.bosses.reduce(
          (acc, b) => acc + (checks[b.id] ? b.points : 0),
          0
        );
        const catChecked = cat.bosses.filter((b) => checks[b.id]).length;

        return (
          <div
            key={cat.name}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
          >
            {/* Category Header */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ borderLeft: `4px solid ${tierColor}` }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      color: tierColor,
                      backgroundColor: `${tierColor}20`,
                    }}
                  >
                    {cat.tier}
                  </span>
                  <h2 className="font-bold">{cat.name}</h2>
                  {mounted && (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {catChecked}/{cat.bosses.length} | +{catPoints.toLocaleString()}pt
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {cat.guide}
                </p>
              </div>
            </div>

            {/* Boss List */}
            <div className="divide-y divide-[var(--border)]">
              {cat.bosses.map((boss) => {
                const checked = mounted && checks[boss.id];
                const isExpanded = expandedBoss === boss.id;

                return (
                  <div key={boss.id} className="px-4 py-3">
                    {/* Boss Row */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleBoss(boss.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-colors ${
                          checked
                            ? "border-[var(--accent-green)] bg-[var(--accent-green)] text-white"
                            : "border-[var(--text-secondary)]"
                        }`}
                      >
                        {checked && "✓"}
                      </button>

                      {/* Boss Image */}
                      {(bossImages.images as Record<string, string>)[boss.name] && (
                        <Image
                          src={`/images/bosses/${(bossImages.images as Record<string, string>)[boss.name]}`}
                          alt={boss.name}
                          width={36}
                          height={36}
                          className="rounded shrink-0"
                        />
                      )}

                      <button
                        onClick={() =>
                          setExpandedBoss(isExpanded ? null : boss.id)
                        }
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              checked
                                ? "line-through text-[var(--text-secondary)]"
                                : ""
                            }`}
                          >
                            {boss.name}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {boss.difficulty}
                          </span>
                        </div>
                      </button>

                      <span className="text-sm font-bold text-[var(--accent-orange)] shrink-0">
                        +{boss.points.toLocaleString()}
                      </span>

                      <button
                        onClick={() =>
                          setExpandedBoss(isExpanded ? null : boss.id)
                        }
                        className="text-[var(--text-secondary)] text-xs shrink-0"
                      >
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="mt-3 ml-8 space-y-2 text-sm">
                        <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                          <div className="text-[var(--accent-green)] font-medium mb-1">
                            왜 잡아야 해?
                          </div>
                          <div className="text-[var(--text-secondary)]">
                            {boss.reason}
                          </div>
                        </div>
                        {boss.warning && (
                          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                            <div className="text-[var(--accent-orange)] font-medium mb-1">
                              주의사항
                            </div>
                            <div className="text-[var(--text-secondary)]">
                              {boss.warning}
                            </div>
                          </div>
                        )}
                        {boss.drops && boss.drops.length > 0 && (
                          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                            <div className="text-[var(--accent-blue)] font-medium mb-1">
                              핵심 드롭
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {boss.drops.map((drop) => (
                                <span
                                  key={drop}
                                  className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]"
                                >
                                  {drop}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="text-xs text-[var(--text-secondary)]">
                          {boss.type === "daily"
                            ? "일일 보스"
                            : boss.type === "weekly"
                            ? "주간 보스 (목 초기화)"
                            : "월간 보스 (1일 초기화)"}{" "}
                          | {boss.coins} 코인
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Crystal Info */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <h2 className="font-bold mb-2">결정석 판매 한도</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <span className="text-[var(--text-secondary)]">캐릭터당</span>
            <span className="font-bold ml-2">주 12개</span>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <span className="text-[var(--text-secondary)]">월드당</span>
            <span className="font-bold ml-2">주 90개</span>
          </div>
        </div>
      </div>
    </div>
  );
}
