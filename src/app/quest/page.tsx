"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import weeklyData from "@/data/weekly.json";

type CheckState = "unchecked" | "checked" | "skipped";
type TabType = "checklist" | "regions" | "etc";
type CellState = string | null;

const STORAGE_KEY = "chalguide_quest_checks";
const CHASER_KEY = "chalguide_chaser_grid";

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
  } catch { return {}; }
}
function saveChecks(checks: Record<string, CheckState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ checks, resetAt: getResetTimestamp() }));
}

// ===== Midnight Chaser Helper Component =====
function MidnightChaserHelper({ furniture }: { furniture: { id: string; emoji: string; name: string }[] }) {
  const [grid, setGrid] = useState<CellState[]>(Array(9).fill(null));
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [foundOrder, setFoundOrder] = useState<string[]>([]);

  const usedFurniture = grid.filter((c): c is string => c !== null);
  const available = furniture.filter((f) => !usedFurniture.includes(f.id));

  const assign = useCallback((ci: number, fid: string) => {
    setGrid((p) => { const n = [...p]; n[ci] = fid; return n; });
    setActiveCell(null);
  }, []);
  const clear = useCallback((ci: number) => {
    const removed = grid[ci];
    setGrid((p) => { const n = [...p]; n[ci] = null; return n; });
    if (removed) setFoundOrder((p) => p.filter((id) => id !== removed));
    setActiveCell(null);
  }, [grid]);
  const toggleFound = useCallback((fid: string) => {
    setFoundOrder((p) => p.includes(fid) ? p.filter((id) => id !== fid) : [...p, fid]);
  }, []);
  const resetChaser = () => { setGrid(Array(9).fill(null)); setActiveCell(null); setFoundOrder([]); };

  return (
    <div className="space-y-3">
      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2">
        {grid.map((cell, i) => {
          const f = cell ? furniture.find((x) => x.id === cell) : null;
          const isFound = cell ? foundOrder.includes(cell) : false;
          const foundIdx = cell ? foundOrder.indexOf(cell) : -1;
          return (
            <button
              key={i}
              onClick={() => f ? toggleFound(f.id) : setActiveCell(activeCell === i ? null : i)}
              className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
                isFound ? "border-emerald-500/50 bg-emerald-500/10"
                : f ? "border-orange-500/30 bg-slate-800/60"
                : activeCell === i ? "border-blue-500/50 bg-blue-500/10"
                : "border-slate-700/50 bg-slate-800/40 border-dashed"
              }`}
            >
              {f ? (
                <>
                  <span className={`text-2xl ${isFound ? "opacity-40" : ""}`}>{f.emoji}</span>
                  <span className={`text-[9px] font-bold ${isFound ? "text-emerald-400 line-through" : "text-slate-300"}`}>{f.name}</span>
                  {isFound && <span className="absolute top-0.5 right-1.5 text-[10px] font-black text-emerald-400">{foundIdx + 1}</span>}
                </>
              ) : (
                <span className="text-sm text-slate-600">방{i + 1}</span>
              )}
              {f && !isFound && (
                <button onClick={(e) => { e.stopPropagation(); clear(i); }} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-[8px] flex items-center justify-center">✕</button>
              )}
            </button>
          );
        })}
      </div>

      {/* Picker */}
      {activeCell !== null && (
        <div className="p-2 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <div className="text-[10px] text-blue-400 font-bold mb-1.5">방{activeCell + 1}에 놓을 가구</div>
          <div className="grid grid-cols-3 gap-1.5">
            {available.map((f) => (
              <button key={f.id} onClick={() => assign(activeCell, f.id)} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 active:scale-95 text-xs">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-[9px] text-slate-400">{f.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setActiveCell(null)} className="mt-1.5 w-full text-[10px] text-slate-500 py-0.5">닫기</button>
        </div>
      )}

      {/* Progress + Reset */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>배치 {usedFurniture.length}/9 · 발견 {foundOrder.length}/9</span>
        <button onClick={resetChaser} className="px-2 py-0.5 rounded border border-slate-700 active:scale-95">초기화</button>
      </div>

      {foundOrder.length === 9 && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center">
          <div className="text-xl mb-1">🎉</div>
          <div className="text-sm font-bold text-emerald-400">클리어!</div>
        </div>
      )}
    </div>
  );
}

// ===== Recipe Helper Component =====
function RecipeHelper({ recipes }: { recipes: { name: string; ingredients: string[] }[] }) {
  const [search, setSearch] = useState("");
  const filtered = recipes.filter((r) => r.name.includes(search) || r.ingredients.some((i) => i.includes(search)));
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="레시피 검색 (예: 앗볶음, 초록)"
        className="w-full bg-slate-900/40 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-orange-500 placeholder:text-slate-600"
      />
      <div className="grid grid-cols-2 gap-1.5">
        {filtered.map((r) => (
          <div key={r.name} className="p-2 rounded-lg bg-slate-900/40 text-xs">
            <div className="font-bold text-orange-400 mb-0.5">{r.name}</div>
            <div className="text-slate-400">{r.ingredients.join(" + ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Main Page =====
export default function QuestPage() {
  const [tab, setTab] = useState<TabType>("checklist");
  const [level, setLevel] = useState<number>(260);
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  const [mounted, setMounted] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  useEffect(() => {
    setChecks(loadChecks());
    const sl = localStorage.getItem("chalguide_quest_level");
    if (sl) setLevel(parseInt(sl) || 260);
    setMounted(true);
  }, []);

  const toggleCheck = (id: string) => {
    const c = checks[id] || "unchecked";
    const next: CheckState = c === "unchecked" ? "checked" : c === "checked" ? "skipped" : "unchecked";
    const u = { ...checks, [id]: next };
    setChecks(u); saveChecks(u);
  };
  const resetAll = () => { setChecks({}); saveChecks({}); };
  const updateLevel = (v: number) => { setLevel(v); localStorage.setItem("chalguide_quest_level", String(v)); };

  const regions = weeklyData.regions.filter((r) => r.unlockLevel <= level);
  const lockedRegions = weeklyData.regions.filter((r) => r.unlockLevel > level);
  const contents = weeklyData.contents.filter((c) => c.unlockLevel <= level);
  const lockedContents = weeklyData.contents.filter((c) => c.unlockLevel > level);

  // All checkable items
  const allItems = [
    ...regions.map((r) => ({ id: r.id + "_weekly", name: r.weeklyContent.name, label: r.name })),
    ...regions.map((r) => ({ id: r.id + "_daily", name: r.dailyContent.name, label: r.name })),
    ...contents.map((c) => ({ id: c.id, name: c.name, label: "" })),
  ];
  const checkedCount = allItems.filter((i) => checks[i.id] === "checked").length;
  const totalItems = allItems.length;

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-20 md:py-10">
      <div className="mb-3">
        <h1 className="text-xl md:text-3xl font-black mb-1">📋 주간퀘스트 헬퍼</h1>
        <p className="text-xs text-slate-400">체크리스트 + 지역별 공략. 매주 목요일 자동 초기화.</p>
      </div>

      {/* Level + Reset */}
      <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40">
        <span className="text-[11px] text-slate-500">Lv.</span>
        <input type="number" min={200} max={300} value={level} onChange={(e) => updateLevel(Number(e.target.value) || 200)}
          className="bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1 w-16 text-sm font-bold outline-none focus:border-orange-500 text-center" />
        <span className="text-[11px] text-slate-500 flex-1">지역 {regions.length}/{weeklyData.regions.length}</span>
        <button onClick={resetAll} className="text-[11px] text-slate-500 px-2 py-0.5 rounded border border-slate-700 active:scale-95">초기화</button>
      </div>

      {/* 3 Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-slate-800/40 border border-slate-700/50">
        {([
          { id: "checklist" as TabType, label: "✅ 체크", emoji: "" },
          { id: "regions" as TabType, label: "🗺️ 지역별", emoji: "" },
          { id: "etc" as TabType, label: "📌 기타", emoji: "" },
        ]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t.id ? "bg-orange-500/20 text-orange-400" : "text-slate-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== 체크리스트 탭 ===== */}
      {tab === "checklist" && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">주간 진행도</span>
              <span className="font-bold"><span className="text-emerald-400">{checkedCount}</span><span className="text-slate-500">/{totalItems}</span></span>
            </div>
            <div className="h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(checkedCount / totalItems) * 100}%` }} />
            </div>
          </div>

          {/* Region weeklies */}
          <div className="text-[10px] text-slate-600 font-bold uppercase mb-1">아케인 리버 주간</div>
          {regions.map((r) => {
            const wId = r.id + "_weekly";
            const st = checks[wId] || "unchecked";
            return (
              <button key={wId} onClick={() => toggleCheck(wId)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left active:scale-[0.98] transition-all ${
                  st === "checked" ? "border-emerald-500/30 bg-emerald-500/5" : st === "skipped" ? "border-slate-700/30 opacity-40" : "border-slate-700/50 bg-slate-800/40"
                }`}>
                <span className="text-lg">{st === "checked" ? "✅" : st === "skipped" ? "⏭️" : "🔮"}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs ${st === "checked" ? "line-through text-slate-500" : ""}`}>{r.weeklyContent.name}</div>
                  <div className="text-[10px] text-slate-500">{r.name} · 주{r.weeklyContent.maxPerWeek}회 · 심볼{r.weeklyContent.rewardPerClear}개</div>
                </div>
                <span className="text-[9px] text-slate-600">{st === "unchecked" ? "탭" : st === "checked" ? "스킵" : "해제"}</span>
              </button>
            );
          })}

          {/* Region dailies */}
          <div className="text-[10px] text-slate-600 font-bold uppercase mt-3 mb-1">일일 심볼</div>
          {regions.map((r) => {
            const dId = r.id + "_daily";
            const st = checks[dId] || "unchecked";
            return (
              <button key={dId} onClick={() => toggleCheck(dId)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left active:scale-[0.98] transition-all ${
                  st === "checked" ? "border-emerald-500/30 bg-emerald-500/5" : st === "skipped" ? "border-slate-700/30 opacity-40" : "border-slate-700/50 bg-slate-800/40"
                }`}>
                <span className="text-lg">{st === "checked" ? "✅" : st === "skipped" ? "⏭️" : "📋"}</span>
                <div className="flex-1"><div className={`font-bold text-xs ${st === "checked" ? "line-through text-slate-500" : ""}`}>{r.name} 일일</div></div>
              </button>
            );
          })}

          {/* Other contents */}
          <div className="text-[10px] text-slate-600 font-bold uppercase mt-3 mb-1">기타 콘텐츠</div>
          {contents.map((c) => {
            const st = checks[c.id] || "unchecked";
            return (
              <button key={c.id} onClick={() => toggleCheck(c.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left active:scale-[0.98] transition-all ${
                  st === "checked" ? "border-emerald-500/30 bg-emerald-500/5" : st === "skipped" ? "border-slate-700/30 opacity-40" : "border-slate-700/50 bg-slate-800/40"
                }`}>
                <span className="text-lg">{st === "checked" ? "✅" : st === "skipped" ? "⏭️" : "📌"}</span>
                <div className="flex-1"><div className={`font-bold text-xs ${st === "checked" ? "line-through text-slate-500" : ""}`}>{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.frequency}</div>
                </div>
              </button>
            );
          })}

          <div className="text-center text-[10px] text-slate-600 pt-1">탭1=✅완료 · 탭2=⏭️스킵 · 탭3=해제</div>
        </div>
      )}

      {/* ===== 지역별 공략 탭 ===== */}
      {tab === "regions" && (
        <div className="space-y-2">
          {regions.map((r) => {
            const isOpen = expandedRegion === r.id;
            const wc = r.weeklyContent;
            return (
              <div key={r.id} className="rounded-xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
                <button onClick={() => setExpandedRegion(isOpen ? null : r.id)} className="w-full p-3 text-left active:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔮</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{r.name}</div>
                      <div className="text-[11px] text-slate-500">{wc.name} · {wc.type} · 심볼{wc.rewardPerClear}개/회</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <div>Lv.{r.unlockLevel}+</div>
                      <div>{isOpen ? "▲" : "▼"}</div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    {/* Weekly Content Info */}
                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                      <div className="font-bold text-xs text-orange-400 mb-1">{wc.name}</div>
                      <div className="text-xs text-slate-400 mb-2">{wc.desc}</div>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mb-2">
                        <span>주 {wc.maxPerWeek}회</span>
                        <span>⏰ {wc.timeLimit}</span>
                        <span>🎁 {wc.reward}</span>
                      </div>
                    </div>

                    {/* Guide */}
                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                      <div className="text-xs text-emerald-400 font-bold mb-1">공략</div>
                      {wc.guide.map((tip, i) => (
                        <div key={i} className="text-xs text-slate-400 flex gap-1.5 mb-0.5">
                          <span className="text-emerald-400">•</span>{tip}
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                      <div className="text-xs text-blue-400 font-bold mb-1">팁</div>
                      {wc.tips.map((tip, i) => (
                        <div key={i} className="text-xs text-slate-400 flex gap-1.5 mb-0.5">
                          <span className="text-blue-400">💡</span>{tip}
                        </div>
                      ))}
                    </div>

                    {/* Instant Clear */}
                    <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <div className="text-xs text-amber-400 font-bold mb-0.5">즉시완료</div>
                      <div className="text-xs text-slate-400">{wc.instantClear}</div>
                    </div>

                    {/* Midnight Chaser Helper */}
                    {"hasChaserHelper" in wc && (wc as { hasChaserHelper: boolean }).hasChaserHelper && (
                      <div className="p-3 rounded-lg bg-slate-900/40 border border-orange-500/20">
                        <div className="text-xs text-orange-400 font-bold mb-2">🌙 미드나잇 체이서 헬퍼</div>
                        <div className="text-[10px] text-slate-500 mb-2">방에 들어가 가구를 확인 → 칸에 기록 → 찾으면 탭</div>
                        <MidnightChaserHelper furniture={(wc as { furniture: { id: string; emoji: string; name: string }[] }).furniture} />
                      </div>
                    )}

                    {/* Recipe Helper */}
                    {"hasRecipeHelper" in wc && (wc as { hasRecipeHelper: boolean }).hasRecipeHelper && (
                      <div className="p-3 rounded-lg bg-slate-900/40 border border-orange-500/20">
                        <div className="text-xs text-orange-400 font-bold mb-2">🍳 레시피 헬퍼</div>
                        <RecipeHelper recipes={(wc as { recipes: { name: string; ingredients: string[] }[] }).recipes} />
                      </div>
                    )}

                    {/* YouTube */}
                    <a href={`https://youtube.com/results?search_query=메이플+${wc.name}+공략`} target="_blank" rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-slate-900/40 text-center text-xs text-blue-400 active:text-orange-400">
                      유튜브에서 {wc.name} 공략 검색 →
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {/* Locked */}
          {lockedRegions.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] text-slate-600 font-bold mb-1">🔒 잠김</div>
              {lockedRegions.map((r) => (
                <div key={r.id} className="flex items-center gap-2 p-2 text-xs opacity-30">
                  <span>🔒</span><span>{r.name} — {r.weeklyContent.name}</span>
                  <span className="ml-auto text-slate-600">Lv.{r.unlockLevel}+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== 기타 콘텐츠 탭 ===== */}
      {tab === "etc" && (
        <div className="space-y-2">
          {contents.map((c) => {
            const isOpen = expandedContent === c.id;
            return (
              <div key={c.id} className="rounded-xl border border-slate-700/50 bg-slate-800/40 overflow-hidden">
                <button onClick={() => setExpandedContent(isOpen ? null : c.id)} className="w-full p-3 text-left active:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📌</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.description}</div>
                    </div>
                    <span className="text-[11px] text-slate-500">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                      <div className="text-xs text-emerald-400 font-bold mb-1">공략</div>
                      {c.guide.map((tip, i) => (
                        <div key={i} className="text-xs text-slate-400 flex gap-1.5 mb-0.5">
                          <span className="text-emerald-400">•</span>{tip}
                        </div>
                      ))}
                    </div>
                    {"patterns" in c && (c as { patterns: { name: string; counter: string }[] }).patterns && (
                      <div className="p-2.5 rounded-lg bg-slate-900/40">
                        <div className="text-xs text-orange-400 font-bold mb-1">패턴</div>
                        {(c as { patterns: { name: string; counter: string }[] }).patterns.map((p, i) => (
                          <div key={i} className="text-xs flex gap-2 mb-0.5">
                            <span className="text-orange-400 font-bold min-w-[50px]">{p.name}</span>
                            <span className="text-slate-600">→</span>
                            <span className="text-slate-300">{p.counter}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <a href={`https://youtube.com/results?search_query=${c.youtubeSearch}`} target="_blank" rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-slate-900/40 text-center text-xs text-blue-400 active:text-orange-400">
                      유튜브 공략 검색 →
                    </a>
                  </div>
                )}
              </div>
            );
          })}
          {lockedContents.length > 0 && lockedContents.map((c) => (
            <div key={c.id} className="flex items-center gap-2 p-2 text-xs opacity-30">
              <span>🔒</span><span>{c.name}</span><span className="ml-auto text-slate-600">Lv.{c.unlockLevel}+</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
