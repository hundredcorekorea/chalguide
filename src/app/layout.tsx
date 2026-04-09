import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "챌섭가이드 - 메이플 챌린저스 AI 공략",
  description:
    "메이플스토리 챌린저스 월드 전용 AI 공략 가이드. 보스 체크리스트, 점수 계산기, 직업 추천(47개), 사냥터 가이드. 시즌 3 CROWN 기준.",
  keywords: [
    "메이플스토리", "챌린저스", "챌섭", "공략", "점수 계산기",
    "보스 체크리스트", "직업 추천", "사냥터", "냉동용사", "복귀 가이드",
  ],
  openGraph: {
    title: "챌섭가이드 - 메이플 챌린저스 AI 공략",
    description: "메이플스토리 챌린저스 월드 전용 AI 공략 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-white">
        <Navigation />
        <main>{children}</main>

        {/* Footer — 모바일에선 하단탭 위에, 최소화 */}
        <footer className="border-t border-slate-800 py-4 pb-20 md:pb-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-[11px] md:text-xs text-slate-600">
            <span className="text-orange-400/60 font-bold">챌섭가이드</span> © 2026 · Data based on NEXON Open API · 비공식 팬 사이트
          </div>
        </footer>
      </body>
    </html>
  );
}
