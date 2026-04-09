"use client";

import { useState, useEffect } from "react";
import defrostData from "@/data/defrost.json";
import Link from "next/link";

const STORAGE_KEY = "chalguide_defrost_step";

export default function DefrostPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCurrentStep(parseInt(saved) || 0);
    setMounted(true);
  }, []);

  const completeStep = () => {
    const next = Math.min(currentStep + 1, defrostData.steps.length);
    setCurrentStep(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const progress =
    defrostData.steps.length > 0
      ? (currentStep / defrostData.steps.length) * 100
      : 0;

  const activeStep = defrostData.steps[currentStep];
  const isComplete = currentStep >= defrostData.steps.length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-20 md:py-10 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-3xl font-black mb-1">🧊 해동 가이드</h1>
        <p className="text-xs md:text-sm text-slate-400">챌린저스가 처음이거나, 오랜만에 돌아왔다면.</p>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-secondary)]">해동 진행도</span>
          <span className="font-bold">
            {currentStep} / {defrostData.steps.length} 단계
          </span>
        </div>
        <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-blue)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Completed Steps */}
      {defrostData.steps.slice(0, currentStep).map((step) => (
        <div
          key={step.id}
          className="p-3 rounded-xl border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5"
        >
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-green)]">✅</span>
            <span className="text-sm line-through text-[var(--text-secondary)]">
              {step.order}단계: {step.title}
            </span>
          </div>
        </div>
      ))}

      {/* Active Step */}
      {!isComplete && activeStep && (
        <div className="p-5 rounded-xl border-2 border-[var(--accent-orange)] bg-[var(--bg-card)]">
          <div className="text-xs text-[var(--accent-orange)] font-bold mb-2">
            📌 지금 해야 할 것
          </div>
          <h2 className="text-lg font-bold mb-2">
            {activeStep.order}단계: {activeStep.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            {activeStep.guide}
          </p>

          {/* Tips */}
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] mb-3">
            <div className="text-[var(--accent-green)] font-medium text-sm mb-1">
              💡 팁
            </div>
            {activeStep.tips.map((tip, i) => (
              <div
                key={i}
                className="text-sm text-[var(--text-secondary)] flex gap-2"
              >
                <span className="text-[var(--accent-green)]">•</span>
                {tip}
              </div>
            ))}
          </div>

          {/* Warnings */}
          {activeStep.warnings.length > 0 && (
            <div className="p-3 rounded-lg bg-[var(--accent-orange)]/5 border border-[var(--accent-orange)]/20 mb-3">
              <div className="text-[var(--accent-orange)] font-medium text-sm mb-1">
                ⚠️ 절대 하지 마세요
              </div>
              {activeStep.warnings.map((w, i) => (
                <div
                  key={i}
                  className="text-sm text-[var(--text-secondary)] flex gap-2"
                >
                  <span className="text-[var(--accent-orange)]">•</span>
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Old vs New */}
          {activeStep.oldVsNew && (
            <div className="p-3 rounded-lg bg-[var(--accent-blue)]/5 border border-[var(--accent-blue)]/20 mb-4">
              <div className="text-[var(--accent-blue)] font-medium text-sm mb-2">
                💡 옛날과 달라진 점
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    옛날
                  </span>
                  <div className="line-through text-[var(--text-secondary)]">
                    {activeStep.oldVsNew.old}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[var(--accent-blue)]">
                    지금
                  </span>
                  <div className="text-[var(--text-primary)]">
                    {activeStep.oldVsNew.new}
                  </div>
                </div>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {activeStep.oldVsNew.tip}
              </div>
            </div>
          )}

          <button
            onClick={completeStep}
            className="w-full py-3 rounded-lg bg-[var(--accent-orange)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            ✓ 완료! 다음 단계로
          </button>
        </div>
      )}

      {/* Future Steps */}
      {defrostData.steps.slice(currentStep + 1).map((step) => (
        <div
          key={step.id}
          className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] opacity-50"
        >
          <div className="flex items-center gap-2">
            <span>○</span>
            <span className="text-sm">
              {step.order}단계: {step.title}
            </span>
          </div>
        </div>
      ))}

      {/* Complete */}
      {isComplete && (
        <div className="p-5 rounded-xl border-2 border-[var(--accent-green)] bg-[var(--accent-green)]/5 text-center">
          <div className="text-3xl mb-3">🎉</div>
          <h2 className="text-lg font-bold mb-2">해동 완료!</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            이제 숙련자 모드로 전환하세요. 점수 계산기에서 다음 목표를
            설정해보세요.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-lg bg-[var(--accent-green)] text-white font-bold text-sm"
          >
            전체 기능 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}
