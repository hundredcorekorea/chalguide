"use client";

/**
 * AdSlot — AdMob 네이티브 광고 슬롯 (웹에서는 placeholder)
 *
 * 웹: placeholder 표시 (빈 공간)
 * Android WebView (Capacitor): 네이티브 AdMob 배너가 이 위치에 오버레이됨
 *
 * data-ad-slot 속성으로 Android 쪽에서 광고 위치를 식별
 */
export default function AdSlot({
  slot = "default",
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  return (
    <div
      data-ad-slot={slot}
      className={`admob-slot ${className}`}
      style={{ minHeight: 50 }}
    >
      {/* Android WebView에서 이 div 위치에 AdMob 배너를 오버레이 */}
      {/* 웹에서는 아무것도 표시하지 않음 (깔끔) */}
    </div>
  );
}
