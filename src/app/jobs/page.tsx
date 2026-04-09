"use client";

import { useState, useMemo } from "react";
import jobData from "@/data/jobs.json";

type FilterType = "all" | "뉴비추천" | "사냥형" | "보스형";
type SortType = "occupancy" | "overall" | "newbie" | "hunting" | "bossing";

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="text-xs">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={i < count ? "text-[var(--accent-gold)]" : "text-[var(--border)]"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function JobsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("occupancy");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let jobs = [...jobData.jobs];

    if (filter === "뉴비추천") {
      jobs = jobs.filter((j) => j.newbieRating >= 4);
    } else if (filter !== "all") {
      jobs = jobs.filter((j) => j.tags.includes(filter));
    }

    jobs.sort((a, b) => {
      let diff = 0;
      switch (sort) {
        case "occupancy": diff = b.occupancy - a.occupancy; break;
        case "overall": diff = b.overall - a.overall; break;
        case "newbie": diff = b.newbieRating - a.newbieRating; break;
        case "hunting": diff = b.hunting - a.hunting; break;
        case "bossing": diff = b.bossing - a.bossing; break;
      }
      // 동점이면 점유율로 2차 정렬
      if (diff === 0) diff = b.occupancy - a.occupancy;
      return diff;
    });

    return jobs;
  }, [filter, sort]);

  const setFilterWithSort = (f: FilterType) => {
    setFilter(f);
    if (f === "사냥형") setSort("hunting");
    else if (f === "보스형") setSort("bossing");
    else if (f === "뉴비추천") setSort("newbie");
    else if (f === "all" && sort !== "occupancy" && sort !== "overall") setSort("occupancy");
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: `전체 (${jobData.jobs.length})` },
    { id: "뉴비추천", label: "뉴비추천" },
    { id: "사냥형", label: "사냥형" },
    { id: "보스형", label: "보스형" },
  ];

  const sorts: { id: SortType; label: string }[] = [
    { id: "occupancy", label: "점유율순" },
    { id: "overall", label: "종합순" },
    { id: "newbie", label: "뉴비순" },
    { id: "hunting", label: "사냥순" },
    { id: "bossing", label: "보스순" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-20 md:py-10 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-3xl font-black mb-1">🎮 직업 추천</h1>
        <p className="text-xs md:text-sm text-slate-400">챌린저스 메타 기준 · 316만건 실측 · 47개 전 직업</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterWithSort(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id
                ? "bg-[var(--accent-orange)] text-white"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2 flex-wrap">
        {sorts.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              sort === s.id
                ? "text-[var(--accent-blue)] border-b-2 border-[var(--accent-blue)]"
                : "text-[var(--text-secondary)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filtered.map((job, index) => {
          const isExpanded = expandedId === job.id;

          return (
            <div
              key={job.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
            >
              {/* Job Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : job.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--text-secondary)] font-mono w-6">
                        {sort === "occupancy" ? `${job.occupancyRank}위` : `#${index + 1}`}
                      </span>
                      <span className="font-bold">{job.name}</span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {job.class}
                      </span>
                      {job.newbieRating >= 4 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent-green)]/15 text-[var(--accent-green)] font-bold">
                          뉴비OK
                        </span>
                      )}
                    </div>

                    {/* Star Ratings */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-secondary)] w-8">사냥</span>
                        <Stars count={job.hunting} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-secondary)] w-8">보스</span>
                        <Stars count={job.bossing} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-secondary)] w-8">난이도</span>
                        <Stars count={job.easyToPlay} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--text-secondary)] w-8">뉴비</span>
                        <Stars count={job.newbieRating} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[var(--accent-blue)]">
                      {job.occupancy}%
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-2 ml-8">
                  {job.oneLiner}
                </p>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 ml-8">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Pros */}
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)] ml-8">
                    <div className="text-[var(--accent-green)] font-medium text-sm mb-1">
                      장점
                    </div>
                    {job.pros.map((pro) => (
                      <div
                        key={pro}
                        className="text-sm text-[var(--text-secondary)] flex gap-2"
                      >
                        <span className="text-[var(--accent-green)]">+</span>
                        {pro}
                      </div>
                    ))}
                  </div>

                  {/* Cons */}
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)] ml-8">
                    <div className="text-[var(--accent-orange)] font-medium text-sm mb-1">
                      단점
                    </div>
                    {job.cons.map((con) => (
                      <div
                        key={con}
                        className="text-sm text-[var(--text-secondary)] flex gap-2"
                      >
                        <span className="text-[var(--accent-orange)]">-</span>
                        {con}
                      </div>
                    ))}
                  </div>

                  {/* Newbie Tip */}
                  {job.newbieTip && (
                    <div className="p-3 rounded-lg bg-[var(--accent-green)]/5 border border-[var(--accent-green)]/20 ml-8">
                      <div className="text-[var(--accent-green)] font-medium text-sm mb-1">
                        🧊 냉동용사 팁
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {job.newbieTip}
                      </div>
                    </div>
                  )}

                  {/* Newbie Warning */}
                  {job.newbieWarning && (
                    <div className="p-3 rounded-lg bg-[var(--accent-orange)]/5 border border-[var(--accent-orange)]/20 ml-8">
                      <div className="text-[var(--accent-orange)] font-medium text-sm mb-1">
                        ⚠️ 주의
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {job.newbieWarning}
                      </div>
                    </div>
                  )}

                  {/* YouTube */}
                  <a
                    href={`https://youtube.com/results?search_query=챌린저스+${encodeURIComponent(job.name)}+공략`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-[var(--bg-secondary)] text-center text-sm text-[var(--accent-blue)] hover:text-[var(--accent-orange)] transition-colors ml-8"
                  >
                    유튜브에서 &apos;{job.name} 공략&apos; 검색 →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
