"use client";

import { useState } from "react";
import glossaryData from "@/data/glossary.json";

const CATEGORY_COLORS: Record<string, string> = {
  스펙: "var(--accent-blue)",
  아이템: "var(--accent-green)",
  보스: "var(--accent-orange)",
  시스템: "var(--accent-purple)",
  콘텐츠: "var(--accent-gold)",
  플레이: "#9ca3af",
  이벤트: "#f472b6",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(glossaryData.terms.map((t) => t.category))),
  ];

  const filtered = glossaryData.terms.filter((term) => {
    const matchCategory = category === "all" || term.category === category;
    const matchSearch =
      !search ||
      term.slang.some((s) => s.includes(search)) ||
      term.official.includes(search) ||
      term.description.includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          📖 <span className="gradient-text">은어 사전</span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          메이플 은어를 탭하면 뜻이 나옵니다. 모르는 단어를 검색해보세요.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="은어 검색 (예: 아포, 블큐, 코강)"
        className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--accent-orange)]"
      />

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              category === cat
                ? "bg-[var(--accent-orange)] text-white"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)]"
            }`}
          >
            {cat === "all" ? "전체" : cat}
          </button>
        ))}
      </div>

      {/* Terms */}
      <div className="space-y-2">
        {filtered.map((term) => {
          const color = CATEGORY_COLORS[term.category] || "#9ca3af";
          return (
            <div
              key={term.id}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--accent-blue)]">
                      {term.slang.join(" / ")}
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      = {term.official}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {term.description}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{ color, backgroundColor: `${color}20` }}
                >
                  {term.category}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-8">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
