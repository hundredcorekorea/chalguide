"use client";

import { useState } from "react";
import huntingData from "@/data/hunting.json";

const AREA_COLORS: Record<string, string> = {
  "버닝 이벤트": "#fbbf24",
  "아케인 리버": "#8b5cf6",
  그란디스: "#22c55e",
};

type Spot = { map: string; mobCount: number | null; reason: string; youtubeSearch: string };

export default function HuntingPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [expandedZone, setExpandedZone] = useState<number | null>(null);

  const matchedZone = selectedLevel !== null
    ? huntingData.zones.findIndex((zone) => {
        const parts = zone.levelRange.replace("+", "~999").replace("~", "-").split("-");
        const min = parseInt(parts[0]) || 0;
        const max = parseInt(parts[1]) || 999;
        return selectedLevel >= min && selectedLevel < max;
      })
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          🗺️ <span className="gradient-text">사냥터 가이드</span>
        </h1>
      </div>

      {/* Level Input */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <label className="text-sm text-[var(--text-secondary)] block mb-2">
          현재 레벨을 입력하면 추천 사냥터를 하이라이트합니다
        </label>
        <input
          type="number"
          min={1}
          max={300}
          value={selectedLevel ?? ""}
          onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
          placeholder="예: 265"
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 w-40 outline-none focus:border-[var(--accent-orange)]"
        />
      </div>

      {/* Hunting Zones */}
      <div className="space-y-3">
        {huntingData.zones.map((zone, i) => {
          const isMatch = matchedZone === i;
          const areaColor = AREA_COLORS[zone.area] ?? "#9ca3af";
          const isExpanded = expandedZone === i;
          const spots = (zone.popularSpots as Spot[] | null) || [];

          return (
            <div
              key={i}
              className={`rounded-xl border transition-all overflow-hidden ${
                isMatch
                  ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/5 ring-1 ring-[var(--accent-orange)]/30"
                  : "border-[var(--border)] bg-[var(--bg-card)]"
              }`}
            >
              <button
                onClick={() => setExpandedZone(isExpanded ? null : i)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold">{zone.name}</span>
                      {isMatch && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] font-bold">
                          추천
                        </span>
                      )}
                      {spots.length > 0 && (
                        <span className="text-xs text-[var(--accent-green)]">
                          인기 {spots.length}곳
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {zone.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[var(--accent-blue)]">
                      Lv. {zone.levelRange}
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                      style={{
                        backgroundColor: `${areaColor}20`,
                        color: areaColor,
                      }}
                    >
                      {zone.area}
                    </span>
                  </div>
                </div>
                {zone.force && (
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {zone.forceType}:{" "}
                      <span className="font-bold text-[var(--text-primary)]">
                        {zone.force}
                      </span>
                    </span>
                  </div>
                )}
              </button>

              {/* Expanded: Popular Spots */}
              {isExpanded && spots.length > 0 && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="text-xs font-bold text-[var(--accent-green)] mb-1">
                    인기 사냥터
                  </div>
                  {spots.map((spot, j) => (
                    <div
                      key={j}
                      className="p-3 rounded-lg bg-[var(--bg-secondary)]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">{spot.map}</span>
                        {spot.mobCount && (
                          <span className="text-xs text-[var(--accent-blue)]">
                            ~{spot.mobCount}마리/분
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        {spot.reason}
                      </p>
                      <a
                        href={`https://youtube.com/results?search_query=${spot.youtubeSearch}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--accent-blue)] hover:text-[var(--accent-orange)]"
                      >
                        유튜브에서 사냥 영상 검색 →
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && spots.length === 0 && (
                <div className="px-4 pb-4">
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]">
                    인기 사냥터 데이터 준비 중
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
