// 약관 버전 고르기. 순수 함수만 둡니다(test/legal.test.mjs에서 확인).

export const DOCS = {
  terms: '서비스 이용약관',
  privacy: '개인정보 처리방침',
  location: '위치기반서비스 이용약관',
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

// 베타 버전 정렬(버전 번호가 큰 것이 앞, 첫째가 최신). 베타는 시행일로 거르지 않습니다(시행일 전에도 앱 링크가 열려야 함).
export const sortBeta = (list, get = (x) => x.version) => [...list].sort((a, b) => cmpVer(get(b), get(a)));

// sync가 베타 원문을 어디에 쓸지 정합니다. legacy = beta/<문서>.md 의 { status, version, sha256 } 또는 null.
// 게시된 파일은 고치지 않으므로, 같은 버전이면 건너뛰고(원문이 바뀌었으면 drift), 다른 버전이면 beta/<문서>/<버전>.md 에 draft로 씁니다.
export function pickBetaTarget(doc, version, sha256, legacy, existsPublished = () => false) {
  const dir = `src/content/legal/beta/${doc}`;
  if (legacy && legacy.status === 'published') {
    if (legacy.version === version) return { path: `${dir}.md`, action: legacy.sha256 === sha256 ? 'same' : 'drift' };
    const path = `${dir}/${version}.md`;
    return { path, action: existsPublished(path) ? 'skip' : 'write' };
  }
  return { path: `${dir}.md`, action: 'write' };
}
