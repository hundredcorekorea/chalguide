"use client";

import { useState, useCallback } from "react";

const FURNITURE = [
  { id: "mirror", emoji: "🪞", name: "전신거울" },
  { id: "jewel", emoji: "💎", name: "보석상자" },
  { id: "bed", emoji: "🛏️", name: "침대" },
  { id: "statue", emoji: "🗿", name: "동상" },
  { id: "clock", emoji: "🕰️", name: "괘종시계" },
  { id: "wardrobe", emoji: "🚪", name: "옷장" },
  { id: "musicbox", emoji: "🎵", name: "오르골" },
  { id: "piano", emoji: "🎹", name: "피아노" },
  { id: "sofa", emoji: "🛋️", name: "소파" },
];

type CellState = string | null; // furniture id or null

export default function ChaserPage() {
  // 3x3 grid — each cell holds a furniture id
  const [grid, setGrid] = useState<CellState[]>(Array(9).fill(null));
  // Which cell is being edited (picker open)
  const [activeCell, setActiveCell] = useState<number | null>(null);
  // Sequence of furniture to find (order tracker)
  const [foundOrder, setFoundOrder] = useState<string[]>([]);

  const usedFurniture = grid.filter((c): c is string => c !== null);
  const availableFurniture = FURNITURE.filter((f) => !usedFurniture.includes(f.id));

  const assignFurniture = useCallback((cellIndex: number, furnitureId: string) => {
    setGrid((prev) => {
      const next = [...prev];
      next[cellIndex] = furnitureId;
      return next;
    });
    setActiveCell(null);
  }, []);

  const clearCell = useCallback((cellIndex: number) => {
    setGrid((prev) => {
      const next = [...prev];
      const removedId = next[cellIndex];
      next[cellIndex] = null;
      // Also remove from found order
      if (removedId) {
        setFoundOrder((prev) => prev.filter((id) => id !== removedId));
      }
      return next;
    });
    setActiveCell(null);
  }, []);

  const toggleFound = useCallback((furnitureId: string) => {
    setFoundOrder((prev) => {
      if (prev.includes(furnitureId)) {
        return prev.filter((id) => id !== furnitureId);
      }
      return [...prev, furnitureId];
    });
  }, []);

  const resetAll = () => {
    setGrid(Array(9).fill(null));
    setActiveCell(null);
    setFoundOrder([]);
  };

  const allPlaced = usedFurniture.length === 9;
  const allFound = foundOrder.length === 9;

  // Room labels
  const ROOM_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 md:py-10">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-3xl font-black mb-1">🌙 미드나잇 체이서</h1>
        <p className="text-xs md:text-sm text-slate-400">
          가구 위치를 기록하고, 찾은 순서대로 탭하세요. 주 3회 · 목요일 초기화.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/40 mb-4 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>🔮 레헬른 심볼 40개/회</span>
          <span>⏰ 제한 10분</span>
          <span>📍 Lv.220+</span>
        </div>
      </div>

      {/* 3x3 Grid — Main */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {grid.map((cellFurniture, i) => {
          const furniture = cellFurniture ? FURNITURE.find((f) => f.id === cellFurniture) : null;
          const isFound = cellFurniture ? foundOrder.includes(cellFurniture) : false;
          const foundIndex = cellFurniture ? foundOrder.indexOf(cellFurniture) : -1;
          const isPickerOpen = activeCell === i;

          return (
            <div key={i} className="relative">
              <button
                onClick={() => {
                  if (furniture) {
                    // If furniture placed, toggle found state
                    toggleFound(furniture.id);
                  } else {
                    // Open picker
                    setActiveCell(isPickerOpen ? null : i);
                  }
                }}
                className={`w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  isFound
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : furniture
                    ? "border-orange-500/30 bg-slate-800/60"
                    : isPickerOpen
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-slate-700/50 bg-slate-800/40 border-dashed"
                }`}
              >
                {furniture ? (
                  <>
                    <span className={`text-3xl ${isFound ? "opacity-40" : ""}`}>
                      {furniture.emoji}
                    </span>
                    <span className={`text-[10px] font-bold ${isFound ? "text-emerald-400 line-through" : "text-slate-300"}`}>
                      {furniture.name}
                    </span>
                    {isFound && (
                      <span className="absolute top-1 right-2 text-xs font-black text-emerald-400">
                        {foundIndex + 1}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-lg text-slate-600">+</span>
                    <span className="text-[10px] text-slate-600">방 {ROOM_LABELS[i]}</span>
                  </>
                )}

                {/* Room number */}
                <span className="absolute top-1 left-2 text-[10px] text-slate-600 font-mono">
                  {ROOM_LABELS[i]}
                </span>
              </button>

              {/* Clear button */}
              {furniture && !isFound && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearCell(i); }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-700 text-slate-400 text-[10px] flex items-center justify-center active:scale-90"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Furniture Picker — appears when a cell is active */}
      {activeCell !== null && (
        <div className="mb-4 p-3 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <div className="text-xs text-blue-400 font-bold mb-2">방 {ROOM_LABELS[activeCell]}에 놓을 가구 선택</div>
          <div className="grid grid-cols-3 gap-2">
            {availableFurniture.map((f) => (
              <button
                key={f.id}
                onClick={() => assignFurniture(activeCell, f.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 active:scale-95 active:border-orange-500/50 transition-all"
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[10px] text-slate-400">{f.name}</span>
              </button>
            ))}
            {availableFurniture.length === 0 && (
              <div className="col-span-3 text-center text-xs text-slate-500 py-2">모든 가구가 배치됨</div>
            )}
          </div>
          <button
            onClick={() => setActiveCell(null)}
            className="mt-2 w-full text-xs text-slate-500 py-1"
          >
            닫기
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40">
        <div className="text-xs text-slate-400">
          배치 <span className="font-bold text-orange-400">{usedFurniture.length}</span>/9
          {allPlaced && " ·"} 발견 <span className="font-bold text-emerald-400">{foundOrder.length}</span>/9
        </div>
        <button
          onClick={resetAll}
          className="text-xs text-slate-500 px-2 py-1 rounded border border-slate-700 active:scale-95"
        >
          초기화
        </button>
      </div>

      {/* Found Order */}
      {foundOrder.length > 0 && (
        <div className="mb-4 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40">
          <div className="text-xs text-slate-500 mb-2">찾은 순서</div>
          <div className="flex flex-wrap gap-2">
            {foundOrder.map((fId, i) => {
              const f = FURNITURE.find((x) => x.id === fId)!;
              return (
                <div key={fId} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-xs">
                  <span className="font-bold text-emerald-400">{i + 1}.</span>
                  <span>{f.emoji}</span>
                  <span className="text-slate-400">{f.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion */}
      {allFound && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-center mb-4">
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-emerald-400">클리어!</div>
          <div className="text-xs text-slate-400 mt-1">아케인심볼: 레헬른 x40 획득</div>
        </div>
      )}

      {/* How to use */}
      <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/40 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-400 mb-1">사용법</div>
        <div>1. 방에 들어가서 가구를 확인하면 해당 칸에 기록</div>
        <div>2. 상단에 찾아야 할 가구가 나오면 기록된 위치로 이동</div>
        <div>3. 가구를 찾으면 해당 칸을 탭하여 발견 표시</div>
        <div>4. 잘못 기록했으면 ✕ 버튼으로 삭제</div>
      </div>

      {/* Instant Clear Info */}
      <div className="mt-3 p-3 rounded-xl border border-slate-700/50 bg-slate-800/40 text-xs text-slate-500">
        <div className="font-bold text-slate-400 mb-1">즉시 완료</div>
        <div>아르카나 스토리 완료 → 1회 즉시완료</div>
        <div>모라스 스토리 완료 → 2회 즉시완료 (총 3회 모두 스킵 가능)</div>
      </div>
    </div>
  );
}
