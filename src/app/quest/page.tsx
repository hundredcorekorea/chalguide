"use client";

import { useState } from "react";
import weeklyData from "@/data/weekly.json";

const PRIORITY_COLORS: Record<string, string> = {
  최우선: "#ef4444",
  높음: "#f97316",
  중간: "#fbbf24",
};

const CATEGORY_ICONS: Record<string, string> = {
  심볼: "🔮",
  던전: "🏔️",
  에픽던전: "⚔️",
  챌린저스: "🎯",
};

export default function QuestPage() {
  const [level, setLevel] = useState<number>(260);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unlockedContents = weeklyData.contents.filter(
    (c) => c.unlockLevel <= level
  );
  const lockedContents = weeklyData.contents.filter(
    (c) => c.unlockLevel > level
  );

  return (
    <div className="py-8 space-y-6">
      <h1 className="text-2xl font-bold">주간퀘스트 헬퍼</h1>
      <p className="text-sm text-[var(--text-secondary)]">
        체크리스트가 아니라 &quot;이건 뭐고, 어떻게 해?&quot;를 알려주는 헬퍼.
      </p>

      {/* Level Input */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <label className="text-sm text-[var(--text-secondary)] block mb-2">
          내 레벨 (해금된 콘텐츠만 표시)
        </label>
        <input
          type="number"
          min={200}
          max={300}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) || 200)}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 w-32 outline-none focus:border-[var(--accent-orange)]"
        />
        <div className="mt-2 text-xs text-[var(--text-secondary)]">
          해금됨 {unlockedContents.length}개 / 잠김{" "}
          {lockedContents.length}개
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-secondary)]">콘텐츠 해금</span>
          <span className="font-bold">
            {unlockedContents.length} / {weeklyData.contents.length}
          </span>
        </div>
        <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-purple)] rounded-full transition-all duration-500"
            style={{
              width: `${(unlockedContents.length / weeklyData.contents.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Unlocked Contents */}
      <div className="space-y-3">
        {unlockedContents.map((content) => {
          const isExpanded = expandedId === content.id;
          const priorityColor =
            PRIORITY_COLORS[content.priority] || "#9ca3af";
          const icon = CATEGORY_ICONS[content.category] || "📌";

          return (
            <div
              key={content.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : content.id)
                }
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{icon}</span>
                      <span className="font-bold">{content.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          color: priorityColor,
                          backgroundColor: `${priorityColor}20`,
                        }}
                      >
                        {content.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {content.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-[var(--text-secondary)]">
                      Lv.{content.unlockLevel}+
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {content.frequency}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Guide */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Guide Tips */}
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                    <div className="text-[var(--accent-green)] font-medium text-sm mb-2">
                      공략
                    </div>
                    <ul className="space-y-1.5">
                      {content.guide.map((tip, i) => (
                        <li
                          key={i}
                          className="text-sm text-[var(--text-secondary)] flex gap-2"
                        >
                          <span className="text-[var(--accent-green)] shrink-0">
                            •
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Patterns (if exists) */}
                  {"patterns" in content &&
                    (content as { patterns: { name: string; counter: string }[] }).patterns && (
                      <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                        <div className="text-[var(--accent-orange)] font-medium text-sm mb-2">
                          패턴 & 대응
                        </div>
                        <div className="space-y-2">
                          {(content as { patterns: { name: string; counter: string }[] }).patterns.map(
                            (p: { name: string; counter: string }, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="text-[var(--accent-orange)] font-medium min-w-[80px]">
                                  {p.name}
                                </span>
                                <span className="text-[var(--text-secondary)]">
                                  →
                                </span>
                                <span className="text-[var(--text-primary)]">
                                  {p.counter}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Regions (if exists) */}
                  {"regions" in content &&
                    (content as { regions: string[] }).regions && (
                      <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                        <div className="text-[var(--accent-blue)] font-medium text-sm mb-2">
                          관련 지역
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(content as { regions: string[] }).regions.map(
                            (region: string) => (
                              <span
                                key={region}
                                className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]"
                              >
                                {region}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* YouTube Search Link */}
                  <a
                    href={`https://youtube.com/results?search_query=${content.youtubeSearch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-[var(--bg-secondary)] text-center text-sm text-[var(--accent-blue)] hover:text-[var(--accent-orange)] transition-colors"
                  >
                    유튜브에서 공략 영상 검색 →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Locked Contents */}
      {lockedContents.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-[var(--text-secondary)]">
            아직 잠김 (레벨 올리면 해금)
          </h2>
          {lockedContents.map((content) => (
            <div
              key={content.id}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="text-sm">{content.name}</span>
                <span className="text-xs text-[var(--text-secondary)] ml-auto">
                  Lv.{content.unlockLevel}+
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
