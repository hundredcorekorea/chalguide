"use client";

import { useState, useEffect, useMemo } from "react";
import weeklyData from "@/data/weekly.json";

type CheckState = "unchecked" | "checked" | "skipped";
type TabType = "checklist" | "guide";

const STORAGE_KEY = "chalguide_quest_checks";

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

function getResetTimestamp(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = day >= 4 ? day - 4 : day + 3;
  const last = new Date(now);
  last.setDate(now.getDate() - diff);
  last.setHours(0, 0, 0, 0);
  return last.getTime();
}

function loadChecks(): Record<string, CheckState> {
  if (typeof window === "undefined") return {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.resetAt && saved.resetAt < getResetTimestamp()) return {};
    return saved.checks || {};
  } catch {
    return {};
  }
}

function saveChecks(checks: Record<string, CheckState>) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ checks, resetAt: getResetTimestamp() })
  );
}

export default function QuestPage() {
  const [tab, setTab] = useState<TabType>("checklist");
  const [level, setLevel] = useState<number>(260);
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setChecks(loadChecks());
    const savedLevel = localStorage.getItem("chalguide_quest_level");
    if (savedLevel) setLevel(parseInt(savedLevel) || 260);
    setMounted(true);
  }, []);

  const toggleCheck = (id: string) => {
    const current = checks[id] || "unchecked";
    const next: CheckState =
      current === "unchecked" ? "checked" :
      current === "checked" ? "skipped" : "unchecked";
    const updated = { ...checks, [id]: next };
    setChecks(updated);
    saveChecks(updated);
  };

  const resetAll = () => {
    setChecks({});
    saveChecks({});
  };

  const updateLevel = (v: number) => {
    setLevel(v);
    localStorage.setItem("chalguide_quest_level", String(v));
  };

  const unlocked = weeklyData.contents.filter((c) => c.unlockLevel <= level);
  const locked = weeklyData.contents.filter((c) => c.unlockLevel > level);

  const checkedCount = unlocked.filter((c) => checks[c.id] === "checked").length;
  const skippedCount = unlocked.filter((c) => checks[c.id] === "skipped").length;
  const totalUnlocked = unlocked.length;

  // 가이드 탭 — 검색 필터
  const filteredGuides = useMemo(() => {
    if (!search) return unlocked;
    const q = search.toLowerCase();
    return unlocked.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [search, unlocked]);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-20 md:py-10">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-3xl font-black mb-1">📋 주간퀘스트 헬퍼</h1>
        <p className="text-xs md:text-sm text-slate-400">체크리스트 + 공략 가이드. 매주 목요일 자동 초기화.</p>
      </div>

      {/* Level Input — 컴팩트 */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40">
        <span className="text-xs text-slate-500">내 레벨</span>
        <input
          type="number"
          min={200}
          max={300}
          value={level}
          onChange={(e) => updateLevel(Number(e.target.value) || 200)}
          className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-1.5 w-20 text-sm font-bold outline-none focus:border-orange-500 text-center"
        />
        <span className="text-xs text-slate-500">해금 {totalUnlocked}/{weeklyData.contents.length}</span>
        <div className="flex-1" />
        <button
          onClick={resetAll}
          className="text-xs text-slate-500 px-2 py-1 rounded border border-slate-700 active:scale-95"
        >
          초기화
        </button>
      </div>

      {/* Tab — 미드나잇체이서(체크리스트) / 무토레시피(가이드) */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <button
          onClick={() => setTab("checklist")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "checklist" ? "bg-orange-500/20 text-orange-400" : "text-slate-500"
          }`}
        >
          ✅ 체크리스트
        </button>
        <button
          onClick={() => setTab("guide")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "guide" ? "bg-blue-500/20 text-blue-400" : "text-slate-500"
          }`}
        >
          📖 공략 가이드
        </button>
      </div>

      {/* ===== 체크리스트 탭 (미드나잇 체이서 스타일) ===== */}
      {tab === "checklist" && (
        <div className="space-y-3">
          {/* Progress */}
          <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/40">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">주간 진행도</span>
              <span className="font-bold">
                <span className="text-emerald-400">{checkedCount}</span>
                {skippedCount > 0 && <span className="text-slate-500"> +{skippedCount} 스킵</span>}
                <span className="text-slate-500"> / {totalUnlocked}</span>
              </span>
            </div>
            <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(checkedCount / totalUnlocked) * 100}%` }}
              />
              <div
                className="h-full bg-slate-600 transition-all duration-300"
                style={{ width: `${(skippedCount / totalUnlocked) * 100}%` }}
              />
            </div>
          </div>

          {/* Quest Grid — 미드나잇 체이서처럼 시각적 그리드 */}
          <div className="grid grid-cols-1 gap-2">
            {unlocked.map((content) => {
              const state = checks[content.id] || "unchecked";
              const icon = CATEGORY_ICONS[content.category] || "📌";
              const pColor = PRIORITY_COLORS[content.priority] || "#9ca3af";

              return (
                <button
                  key={content.id}
                  onClick={() => toggleCheck(content.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left active:scale-[0.98] transition-all ${
                    state === "checked"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : state === "skipped"
                      ? "border-slate-700/30 bg-slate-800/20 opacity-40"
                      : "border-slate-700/50 bg-slate-800/40"
                  }`}
                >
                  {/* State indicator */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                    state === "checked"
                      ? "bg-emerald-500/20"
                      : state === "skipped"
                      ? "bg-slate-700/30"
                      : "bg-slate-800/60"
                  }`}>
                    {state === "checked" ? "✅" : state === "skipped" ? "⏭️" : icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${
                        state === "checked" ? "line-through text-slate-500" : ""
                      }`}>
                        {content.name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ color: pColor, backgroundColor: `${pColor}20` }}
                      >
                        {content.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{content.frequency}</div>
                  </div>

                  {/* Tap hint */}
                  <div className="text-[10px] text-slate-600 shrink-0">
                    {state === "unchecked" ? "탭" : state === "checked" ? "스킵" : "해제"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Locked */}
          {locked.length > 0 && (
            <div className="space-y-1 mt-4">
              <h3 className="text-xs font-bold text-slate-600 mb-2">🔒 잠김 (레벨 올리면 해금)</h3>
              {locked.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg opacity-30 text-sm">
                  <span>🔒</span>
                  <span>{c.name}</span>
                  <span className="text-xs text-slate-600 ml-auto">Lv.{c.unlockLevel}+</span>
                </div>
              ))}
            </div>
          )}

          {/* 3-state legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 pt-2">
            <span>탭 1번 = ✅ 완료</span>
            <span>탭 2번 = ⏭️ 스킵</span>
            <span>탭 3번 = 해제</span>
          </div>
        </div>
      )}

      {/* ===== 가이드 탭 (무토 레시피 스타일 — 검색 + 상세) ===== */}
      {tab === "guide" && (
        <div className="space-y-3">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="퀘스트 검색 (예: 심볼, 에픽, 사냥)"
            className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 placeholder:text-slate-600"
          />

          {/* Results */}
          <div className="space-y-2">
            {filteredGuides.map((content) => {
              const isExpanded = expandedId === content.id;
              const icon = CATEGORY_ICONS[content.category] || "📌";
              const pColor = PRIORITY_COLORS[content.priority] || "#9ca3af";

              return (
                <div
                  key={content.id}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/40 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : content.id)}
                    className="w-full p-3 text-left active:bg-slate-800/60"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm">{content.name}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ color: pColor, backgroundColor: `${pColor}20` }}
                          >
                            {content.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{content.description}</p>
                      </div>
                      <div className="text-right shrink-0 text-[11px] text-slate-500">
                        <div>Lv.{content.unlockLevel}+</div>
                        <div>{content.frequency}</div>
                        <div className="mt-1">{isExpanded ? "▲" : "▼"}</div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2">
                      {/* Guide Tips */}
                      <div className="p-3 rounded-lg bg-slate-900/40">
                        <div className="text-emerald-400 font-medium text-xs mb-2">공략 팁</div>
                        <ul className="space-y-1">
                          {content.guide.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-400 flex gap-2">
                              <span className="text-emerald-400 shrink-0">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Patterns */}
                      {"patterns" in content && (content as { patterns: { name: string; counter: string }[] }).patterns && (
                        <div className="p-3 rounded-lg bg-slate-900/40">
                          <div className="text-orange-400 font-medium text-xs mb-2">패턴 & 대응</div>
                          <div className="space-y-1.5">
                            {(content as { patterns: { name: string; counter: string }[] }).patterns.map((p, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-orange-400 font-bold min-w-[60px]">{p.name}</span>
                                <span className="text-slate-600">→</span>
                                <span className="text-slate-300">{p.counter}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regions */}
                      {"regions" in content && (content as { regions: string[] }).regions && (
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {(content as { regions: string[] }).regions.map((r) => (
                            <span key={r} className="text-[11px] px-2 py-1 rounded-lg bg-slate-900/40 text-slate-400 border border-slate-700/50">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* YouTube */}
                      <a
                        href={`https://youtube.com/results?search_query=${content.youtubeSearch}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2.5 rounded-lg bg-slate-900/40 text-center text-xs text-blue-400 active:text-orange-400"
                      >
                        유튜브에서 공략 영상 검색 →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredGuides.length === 0 && (
              <div className="text-center py-8 text-slate-600 text-sm">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
