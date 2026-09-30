# [서비스명] 안내 홈페이지 — 세션 C 작업 규칙

앱의 안내용 정적 홈페이지 구현 세션(C)입니다. 기획은 별도 대화, 앱·서버 총괄은 세션 A가 맡습니다.
세션을 시작하면 `HANDOFF.md`를 먼저 읽습니다.

## 기준 문서
- 사이트 규칙: @docs/HOMEPAGE_RULES.md
- 문안: `docs/CONTENT.md` (문안을 늘리거나 약속을 새로 적지 않습니다)

## 세션 규칙 (사이트 규칙에 더해)
1. 수정은 `~/projects/tailory-web`에서만 합니다.
2. 앱 저장소 `~/projects/tailory`는 읽기만 합니다. 파일 수정과 git 명령은 하지 않습니다.
3. Supabase(운영·개발)와 앱 DB에 접속하지 않고, MCP도 연결하지 않습니다.
   서버 쪽 변경이 필요하면 초안만 쓰고 "A 요청"으로 보고합니다.
   - 예외(오너 허락 2026-10-01, 세션 우편함): Supabase 옛 프로젝트 Tailory(싱가포르, hbveaqbxsflummipkmht)의 hub.messages·hub.items에서 recipient가 C인 방송 읽기, 내 hub.items 상태 바꾸기, recipient=hub 보고·request 쓰기만 허용. 그 밖의 Supabase 프로젝트·표 접근은 계속 금지.
   - 오너가 「우편함 확인해」라고 하면 이 예외 범위 안에서 C 방송을 읽고 진행합니다.
4. 저장소 만들기, push, Pages 설정처럼 밖으로 나가는 작업은 오너 승인 후에만 합니다.
5. 보고는 쉬운 한국어로, 코드·문서 근거로 합니다.
