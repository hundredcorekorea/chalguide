export default function PrivacyPage() {
  return (
    <div className="py-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <div className="text-sm text-[var(--text-secondary)] space-y-4">
        <p>
          챌섭가이드(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며,
          개인정보 보호법을 준수합니다.
        </p>

        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          1. 수집하는 개인정보
        </h2>
        <p>
          서비스는 별도의 회원가입 없이 이용 가능하며, 개인정보를 수집하지
          않습니다. 체크리스트 데이터는 사용자의 기기(localStorage)에만
          저장됩니다.
        </p>

        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          2. 광고
        </h2>
        <p>
          서비스는 Google AdMob/AdSense를 통한 광고를 게재합니다. 광고
          제공을 위해 Google이 기기 식별자 및 쿠키를 수집할 수 있습니다.
          자세한 내용은 Google의 개인정보처리방침을 참고하세요.
        </p>

        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          3. 데이터 저장
        </h2>
        <p>
          보스 체크리스트, 해동 가이드 진행도 등의 데이터는 사용자의 기기
          브라우저(localStorage)에만 저장되며, 서버로 전송되지 않습니다.
          브라우저 캐시 삭제 시 데이터가 초기화될 수 있습니다.
        </p>

        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          4. 문의
        </h2>
        <p>
          개인정보 관련 문의: osu355@gmail.com
          <br />
          개발: Hundred Core
        </p>

        <p className="text-xs">시행일: 2026년 4월 1일</p>
      </div>
    </div>
  );
}
