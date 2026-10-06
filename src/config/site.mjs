// 사이트 설정값은 여기 한 곳에만 둡니다. 페이지에 직접 쓰지 않습니다.
// 대괄호 값은 자리표시입니다(docs/CONTENT.md 끝 목록). launchReady: true면 CI가 남은 자리표시를 실패로 막습니다(false일 때는 경고만).

const androidPackage = 'com.sojaeha.walklog'; // 서비스명과 분리된 값, 바꾸지 않습니다

export const site = {
  // 주소: 도메인 heelo.app(루트 배포라 base '/'). 예전 임시 주소는 sapphireses-jpg.github.io/heelo-web/ (base '/heelo-web/').
  url: 'https://heelo.app',
  base: '/',

  serviceName: 'Heelo', // 앱 노출 이름(영문 통일, 오너 결정 2026-10-04). 약관 본문의 {서비스명}도 이 값으로 채웁니다
  serviceNameReading: '힐로', // 처음 소개에 「Heelo(힐로)」로 읽는 법을 보여 줍니다
  contactEmail: 'support@sojaeha.studio',
  replyTime: '3영업일', // 이용약관 제18조
  appDeletePath: '홈 화면 오른쪽 위 설정 아이콘 › 설정 › 회원 탈퇴',
  priceMonthly: '4,900원',
  priceYearly: '39,000원',

  // 약관 초안을 가져오는 sync 스크립트만 씁니다(로컬). 앱 저장소는 읽기만 합니다.
  appRepoPath: '~/projects/tailory',

  launchStatus: 'soon', // 'soon' | 'live'
  launchReady: false,
  // live로 바꿀 때: 링크를 넣고, 공식 배지 파일을 public/badges/app-store.svg, google-play.png로 둡니다.
  storeLinks: { appStore: '', googlePlay: '' },

  // 가족 초대 페이지(/invite/). 앱 열기 주소 형식, {code}가 초대 코드로 바뀝니다. 비워 두면 「앱 열기」 버튼을 숨깁니다(A가 주소 체계를 정하면 채움).
  invite: { openUrlTemplate: 'com.sojaeha.walklog://invite/{code}' },

  androidPackage,
  subscriptionLinks: {
    apple: 'https://apps.apple.com/account/subscriptions',
    google: `https://play.google.com/store/account/subscriptions?package=${androidPackage}`,
  },
  helpLinks: {
    apple: 'https://support.apple.com/ko-kr/118428',
    google: 'https://support.google.com/googleplay/answer/7018481?hl=ko',
  },

  business: {
    name: '소재하 스튜디오(SOJAEHA Studio)', // 등록 상호. 하단 상호·저작권 표기에 씁니다
    shortName: '소재하 스튜디오', // 괄호 안에 넣을 때(계정 삭제 안내의 「운영: …」)
    ceo: '김지용', // 사업자등록증명(2026-09-28) 기준
    regNo: '457-14-02929', // 10자리라 하단에 공정위 「사업자정보 확인」 링크가 자동으로 붙습니다
    mailOrderNo: '제2026-경기하남-1786호',
    lbsNo: '', // 신고번호가 나오면 채웁니다. 비어 있으면 아래 접수 상태를 보여 줍니다
    lbsPending: '접수(2026-09-30), 처리 중',
    address: '', // 공개 여부 결정 대기. 비어 있으면 표시하지 않습니다.
    phone: '010-8000-3670', // 오너가 우선 쓰라고 준 번호(2026-10-06). 사업용 번호가 생기면 교체
  },
};
