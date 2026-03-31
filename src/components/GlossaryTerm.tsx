"use client";

import { useState, useRef, useEffect } from "react";

interface GlossaryTermProps {
  term: string;
  official: string;
  description: string;
}

export default function GlossaryTerm({
  term,
  official,
  description,
}: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="border-b border-dotted border-[var(--accent-blue)] text-[var(--accent-blue)] cursor-help"
      >
        {term}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-xl z-50 text-left">
          <span className="block text-sm font-bold text-[var(--text-primary)] mb-1">
            {official}
          </span>
          <span className="block text-xs text-[var(--text-secondary)]">
            {description}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[var(--bg-card)] border-r border-b border-[var(--border)] rotate-45" />
        </span>
      )}
    </span>
  );
}
