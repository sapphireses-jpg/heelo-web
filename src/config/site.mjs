// 사이트 설정값은 여기 한 곳에만 둡니다. 페이지에 직접 쓰지 않습니다.
// 대괄호 값은 자리표시입니다(docs/CONTENT.md 끝 목록). launchReady: true면 CI가 남은 자리표시를 실패로 막습니다(false일 때는 경고만).

const androidPackage = 'com.sojaeha.walklog'; // 서비스명과 분리된 값, 바꾸지 않습니다

export const site = {
  // 주소: 임시로 github.io 프로젝트 주소. 도메인을 연결하면 url을 바꾸고 base를 '/'로.
  url: 'https://sapphireses-jpg.github.io',
  base: '/tailory-web/',

  serviceName: 'walklog', // 앱 Brand.name과 같은 값. 약관 본문의 {서비스명}도 이 값으로 채웁니다
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
    ceo: '[대표자]',
    regNo: '[사업자등록번호]',
    mailOrderNo: '[통신판매업 신고번호]',
    lbsNo: '[위치기반서비스사업 신고번호]',
    address: '', // 공개 여부 결정 대기. 비어 있으면 표시하지 않습니다.
    phone: '[전화번호]',
  },
};
