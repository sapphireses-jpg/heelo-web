// 약관 버전 고르기. 순수 함수만 둡니다(test/legal.test.mjs에서 확인).

export const DOCS = {
  terms: '서비스 이용약관',
  privacy: '개인정보 처리방침',
  location: '위치기반서비스 이용약관',
  community: '커뮤니티 운영정책',
};

// 오늘 날짜(KST) 'YYYY-MM-DD'
export const todayKST = (now = Date.now()) => new Date(now + 9 * 3600e3).toISOString().slice(0, 10);

export const ymd = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));

const verNum = (v) => v.replace(/^v/, '').split('.').map(Number);
const cmpVer = (a, b) => {
  const x = verNum(a), y = verNum(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  return 0;
};

// versions: [{ version, effective, status, ... }] 한 문서의 버전들. 새것이 앞으로 옵니다.
export function sortVersions(versions) {
  return [...versions].sort((a, b) => ymd(b.effective).localeCompare(ymd(a.effective)) || cmpVer(b.version, a.version));
}

// 현재본: published 중 시행일이 오늘 이하인 가장 최신 버전
export function currentVersion(versions, today) {
  return sortVersions(versions).find((v) => v.status === 'published' && ymd(v.effective) <= today);
}

// 시행 예정: published 중 시행일이 오늘 이후인 것 가운데 가장 가까운 버전
export function upcomingVersion(versions, today) {
  return sortVersions(versions).filter((v) => v.status === 'published' && ymd(v.effective) > today).at(-1);
}
