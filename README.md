# [서비스명] 안내 홈페이지

앱의 안내용 정적 홈페이지입니다. Astro로 빌드하고 GitHub Actions로 GitHub Pages에 배포합니다.
로그인·폼·서버 연결·분석 도구는 없습니다. 문의와 계정 삭제 요청은 메일 링크로만 받습니다.

- 규칙: [`docs/HOMEPAGE_RULES.md`](docs/HOMEPAGE_RULES.md) · 문안: [`docs/CONTENT.md`](docs/CONTENT.md)
- 설정값(서비스명, 문의 메일, 가격, 스토어 링크, 사업자 정보, 주소·base): [`src/config/site.mjs`](src/config/site.mjs) 한 곳

## 로컬에서 보기
```bash
npm ci
npm run dev        # http://localhost:4321/tailory-web/ — draft 약관도 보입니다
npm test           # 약관 버전 고르기 확인
npm run build && npm run check   # 배포와 같은 빌드 + 자동 검사
```

## 배포
`main`에 push하면 빌드 → 검사 → 배포합니다. 매일 00:05(KST)에도 다시 빌드해, 시행일이 된 약관이 현재본으로 바뀝니다.
검사(`scripts/check.mjs`): 외부 리소스·브라우저 JS 0, published 약관의 검토 흔적, 서비스명 뒤 조사(이/가·은/는·을/를·와/과), 자리표시(`launchReady: true`일 때만 실패), published 약관 파일 수정·삭제.

도메인을 연결하면 `src/config/site.mjs`의 `url`을 새 주소로, `base`를 `'/'`로 바꿉니다. 그 아래 경로는 그대로입니다.

## 약관 새 버전 올리는 법
1. `src/content/legal/<문서>/<새 버전>.md` 파일을 새로 만듭니다. 문서: `terms`, `privacy`, `location`, `community`. 버전: `v1.0`, `v1.1` …
   ```markdown
   ---
   title: 서비스 이용약관
   version: v1.1
   announced: 2026-11-01   # 공고일
   effective: 2026-11-08   # 시행일 (공고일과 같아도 됩니다)
   summary: 환불 조건 문구 정리   # 변경 이력 표의 「주요 변경」
   status: draft            # 검토 중에는 draft (배포되지 않고 npm run dev에서만 보임)
   ---

   본문(마크다운)
   ```
2. `npm run dev`로 확인한 뒤 `status: published`로 바꿔 커밋하고 push합니다.
3. 시행일 전에는 현재본 위에 "시행 예정" 안내가 나오고, 시행일 00:05(KST) 빌드부터 현재본으로 바뀝니다.

- **한 번 published로 push한 파일은 고치거나 지우지 않습니다.** 고칠 게 있으면 새 버전 파일을 만듭니다(검사가 막습니다).
- published 파일에 `[검토`, `[개발 확인`, `[DPA`, `검토용 주석`, `법률 검토 쟁점`이 남아 있으면 배포가 실패합니다.
- 원문에 Mermaid 흐름도가 있으면 번호 목록 문장으로 바꿔 넣습니다.
