# HANDOFF — 안내 홈페이지 (2026-09-27 기준)

## 1. 방향
- 기능 없는 **안내 전용 정적 사이트**입니다. 로그인·폼·서버 연결은 없습니다.
- 앱 없이 하는 탈퇴 요청은 **메일(mailto)** 로만 받습니다. 예전의 웹 로그인 탈퇴 페이지(`/delete/`)는 지웠습니다.
- 규칙은 `docs/HOMEPAGE_RULES.md`, 문안은 `docs/CONTENT.md`(v0.96)를 따릅니다.
- 2026-11-10(오너 D-266 · D-268 · D-269, 방송 #932): 첫 화면 가운데 = 생애지도 폰 그림(영상 · 홈 스크립트 지움) · 검색 노출 켬(`launchReady: true`, `sitemap.xml`은 빌드 뒤 `scripts/sitemap.mjs`, `robots.txt`는 `public/`) · App Store 단추 = Apple 공식 배지.
- 2026-11-10(오너 D-267): 이용약관 v1.0 제7조 제3항 오탈자 정정(M 79cce7328, SHA b8bcd0811f2c6)을 같은 파일 교체 + 머리 정보 `corrections` 기록으로 게시. 버전 불변 검사는 「판 · 공고일 · 시행일 · 상태 그대로 + corrections가 이전 기록을 둔 채 늘어남」일 때만 교체를 허락합니다.
- 정식 약관 3종 v1.0은 2026-11-03에 게시했습니다(M 게시본 확정 f5aa180bd, fc3c6bf). 시행일 2026-12-05 전까지는 비공개 베타 약관이 적용되고, `/partners/` 개인정보 링크는 12/5 이후 `/legal/privacy/`로 바꿉니다.

## 2. 구성
- Astro 정적 출력, 브라우저 JS 0. 설정은 `src/config/site.mjs` 한 곳에 있습니다.
- 페이지: `/`, `/support/`, `/account/delete/`, `/legal/`, `/legal/<문서>/`, `/legal/<문서>/<버전>/`, 404
- 약관: 정식 버전이 없어, 이용약관·개인정보 처리방침·위치기반서비스 이용약관 세 문서는 앱 테스트용 **임시 초안**(`src/content/legal/<문서>/preview.md`)을 보여 줍니다(맨 위 초안 안내, noindex). 원본은 앱 저장소 `docs/legal/public/`이고 `npm run sync-legal-preview`로 다시 가져옵니다. 법률 검토가 끝나 오너가 알려 주면 「법률 검토 쟁점」 절과 검토용 주석을 뺀 본문으로 `v1.0.md`(published)를 만들고 preview는 지웁니다.
- 출시 전(`launchReady: false`)에는 모든 페이지에 `noindex, nofollow`가 붙습니다. 출시일 해제 순서는 `docs/LAUNCH.md`.
- 배포: GitHub Actions → Pages. push할 때와 매일 00:05 KST에 다시 빌드합니다.
- 주소: `https://heelo.app/` (base `/`, `public/CNAME`). 예전 임시 주소 `https://sapphireses-jpg.github.io/heelo-web/`는 도메인 연결 뒤 GitHub가 새 주소로 넘겨 줍니다. 저장소 `sapphireses-jpg/heelo-web`

## 3. 남은 일
- **오너**
  - main 브랜치 보호(force push·삭제 금지)
  - 자리표시 값 정하기(목록은 `docs/CONTENT.md` 끝). 서비스명이 정해지면 `serviceName` 한 줄만 바꾸고, 문장 속 조사("[서비스명]이")가 맞는지 확인
  - 도메인 연결 시 `url`·`base` 변경
- **기획 대화**
  - 약관 제17조: 탈퇴 방법에 "홈페이지 계정 삭제 안내(메일 요청)" 추가
  - 처리방침: 웹 로그인 문구는 이제 필요 없음(홈페이지는 쿠키·브라우저 저장소를 쓰지 않음)
  - 문안 확인: 메일 요청은 운영자가 처리하는데, "모든 기기에서 로그아웃"을 서버에서 해 줄 수단이 아직 없음(아래 A 요청)
- **A 요청**
  1. 메일 삭제 요청 처리 절차: 운영자가 계정을 찾아 탈퇴 상태로 바꾸고, 모든 기기의 세션을 끊고, 삭제 예정일을 알리는 방법
  2. 복구 화면(SY-02)과 앱 안 탈퇴(S-04), 30일 자동 삭제 작업 — 홈페이지 문안이 이 동작을 약속합니다
  3. 앱의 실제 탈퇴 메뉴 경로(`[앱 경로: 설정 › … › 탈퇴]`)가 정해지면 알려 주기
