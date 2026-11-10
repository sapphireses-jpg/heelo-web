# 첫 화면 가운데 영상 — 두 안 캡처 (방송 #929 ②, 2026-11-10)

배포된 코드는 바꾸지 않았고, 브라우저에서 임시로 덧입혀 찍은 그림입니다(폭 390 · 1440).

| 파일 | 내용 |
|---|---|
| cur-390 · cur-1440 | 지금 모습 |
| A-390 · A-1440 | ⓐ 영상 자리에 스토어 01 생애지도 그림(`docs/design/store/v4/export/appstore-1320x2868-01-lifemap.png`) |
| B-390 · B-1440 | ⓑ 영상은 두되 카드 테두리 없이 배경과 한 장면 (1440은 지금과 같음 — PC는 이미 테두리 없는 한 장면) |

지금 어색한 이유(폰): 같은 장면 영상을 300×200 카드로 따로 그려, 영상 윗부분의 크림색 하늘이 펠트 배경 위에 빈 상자처럼 겹쳐 보임(배경 펠트 · 카드 속 펠트가 이어지지 않아 같은 장면이 두 번 나옴). 카드 속 강아지는 작고 화면이 흐려 보임(600×400 영상을 확대).

## 안 만들 때 쓸 CSS 요지
- ⓑ(폭 ≤ 600): `#h2-herobg { display: none }` + `.h2-hero-dogcard, .h2-hero-video, .h2-ns { left: 0; right: 0; bottom: 0; width: 100%; height: auto; aspect-ratio: 3/2; border-radius: 0; box-shadow: none; mask-image: linear-gradient(to bottom, transparent 0, #000 38%) }` + `.h2-hero::after { display: none }`. 한계: 폭 390에서 영상 띠가 260px 높이라 강아지가 작음.
- ⓐ: 영상 · 카드 숨기고 `<img>`(폰 150px · PC 300px 너비, 모서리 22~34, 그림자)를 오른쪽 아래에. 새 그림 파일은 `public/`에 복사 필요(1 MB 넘어 WebP로 줄임). 영상 스크립트(예외 6)는 필요 없어져 지울 수 있음(오너 허락 범위 축소).

## 배포 뒤(D-266 반영, 11/10)
after-390 · after-768 · after-1440 = ⓐ 적용 결과(공식 App Store 배지 포함).
