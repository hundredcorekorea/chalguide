import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "챌섭가이드 - 챌린저스 할 때 제일 먼저 여는 곳",
  description:
    "메이플스토리 챌린저스 월드 전용 공략. 점수 계산기, 보스 체크리스트, 직업 추천(47개), 사냥터 가이드, 냉동용사 해동 가이드. 시즌 3 CROWN 기준.",
  keywords: [
    "메이플스토리",
    "챌린저스",
    "챌섭",
    "공략",
    "점수 계산기",
    "보스 체크리스트",
    "직업 추천",
    "사냥터",
    "냉동용사",
    "복귀 가이드",
    "메이플 복귀",
  ],
  openGraph: {
    title: "챌섭가이드 - 챌린저스 할 때 제일 먼저 여는 곳",
    description: "메이플스토리 챌린저스 월드 전용 공략 플랫폼. 점수 계산기, 보스 체크, 직업 추천, 해동 가이드.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 pb-24">{children}</main>
      </body>
    </html>
  );
}
