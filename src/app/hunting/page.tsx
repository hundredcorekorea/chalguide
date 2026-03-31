"use client";

import { useState } from "react";
import huntingData from "@/data/hunting.json";

const AREA_COLORS: Record<string, string> = {
  "버닝 이벤트": "#fbbf24",
  "아케인 리버": "#8b5cf6",
  "그란디스": "#22c55e",
};

export default function HuntingPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const matchedZone = selectedLevel !== null
    ? huntingData.zones.find((zone) => {
        const [min, max] = zone.levelRange.replace("+", "~999").replace("~", "-").split("-").map((s) => parseInt(s) || 0);
        return selectedLevel >= min && selectedLevel < (max || 999);
      })
    : null;

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">사냥터 가이드</h1>

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
          const isMatch = matchedZone === zone;
          const areaColor = AREA_COLORS[zone.area] ?? "#9ca3af";
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all ${
                isMatch
                  ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/5 ring-1 ring-[var(--accent-orange)]/30"
                  : "border-[var(--border)] bg-[var(--bg-card)]"
              }`}
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
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{zone.description}</p>
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
                    <span className="font-bold text-[var(--text-primary)]">{zone.force}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
