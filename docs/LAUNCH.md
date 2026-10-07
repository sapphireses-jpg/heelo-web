# 출시일 noindex 해제 체크리스트

출시 전(`launchReady: false`)에는 모든 페이지에 `<meta name="robots" content="noindex, nofollow">`가 붙습니다(`src/layouts/Base.astro`). **설정값 하나로 풀립니다:** `src/config/site.mjs`의 `launchReady: false` → `true`. (`/invite/` 가족 초대 페이지는 `noindex` 속성으로 출시 뒤에도 항상 검색 제외입니다.)

순서
1. 같은 커밋에서 `launchStatus: 'live'`와 스토어 링크를 넣고, 임시 초안 `src/content/legal/<문서>/preview.md`를 지웁니다(정식 `published` 약관으로 대체). `launchReady: true`이면 CI가 남은 `[자리표시]`와 preview를 실패로 막으므로 빌드가 통과해야 합니다.
2. push·배포 뒤 `https://heelo.app/` 소스에 `noindex`가 없는지 확인합니다.
3. **sitemap은 아직 없습니다**(`public/sitemap.xml` 없음) — 출시 전에 만들어 둡니다(링크 대상: 홈, 고객센터, 계정 삭제 안내, 약관 모음과 현재본 3종. `/invite/`·`/legal/beta/`·`/press/`는 제외). `public/robots.txt`는 지금 없고, 만들 때 `Sitemap:` 한 줄을 넣습니다(`Disallow: /press/`는 허용, 홈과 약관은 막지 않음).
4. Google Search Console(`heelo.app`)에서 「URL 검사」 → 홈 「색인 생성 요청」 → 「Sitemaps」에 `sitemap.xml` 제출. 「noindex에 의해 제외됨」 표시는 다시 크롤링된 뒤 사라집니다.

참고: Google OAuth 브랜드 확인과 스토어 심사는 페이지가 **공개로 접근만 되면** 되고 noindex와 무관합니다. 다만 robots.txt로 Googlebot을 막으면 검증이 실패할 수 있어 홈·처리방침은 절대 막지 않습니다(처리방침 링크가 홈 하단에 있어야 함).
