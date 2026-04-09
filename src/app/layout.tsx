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

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <div>
                <span className="text-orange-400 font-bold">챌섭가이드</span>
                {" "}Copyright © 2026
              </div>
              <div className="text-xs text-center md:text-right">
                Data based on NEXON Open API. 비공식 팬 사이트이며 NEXON과 제휴 관계가 없습니다.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
