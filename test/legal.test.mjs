// 버전 전환 확인용 가짜 문서. 배포 결과물에는 들어가지 않습니다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentVersion, upcomingVersion, sortVersions, todayKST, sortBeta, pickBetaTarget } from '../src/lib/legal.mjs';

const docs = [
  { version: 'v1.0', announced: '2026-01-01', effective: '2026-01-08', status: 'published' },
  { version: 'v1.1', announced: '2026-03-01', effective: '2026-03-01', status: 'published' }, // 공고일 = 시행일
  { version: 'v1.2', announced: '2026-05-01', effective: '2026-05-08', status: 'published' },
  { version: 'v1.10', announced: '2026-06-01', effective: '2026-06-08', status: 'published' },
  { version: 'v2.0', announced: '2026-06-01', effective: '2026-07-01', status: 'draft' },
];

test('시행일 전날까지는 이전 버전이 현재본', () => {
  assert.equal(currentVersion(docs, '2026-05-07').version, 'v1.1');
  assert.equal(upcomingVersion(docs, '2026-05-07').version, 'v1.2');
});

test('시행일 당일부터 새 버전이 현재본', () => {
  assert.equal(currentVersion(docs, '2026-05-08').version, 'v1.2');
  assert.equal(currentVersion(docs, '2026-03-01').version, 'v1.1');
});

test('가장 가까운 시행 예정본을 고른다', () => {
  assert.equal(upcomingVersion(docs, '2026-02-01').version, 'v1.1');
});

test('draft는 현재본·시행 예정본이 되지 않는다', () => {
  assert.equal(currentVersion(docs, '2027-01-01').version, 'v1.10');
  assert.equal(upcomingVersion(docs, '2026-06-30'), undefined);
  assert.equal(currentVersion(docs.filter((d) => d.status === 'draft'), '2027-01-01'), undefined);
});

test('v1.10은 v1.2보다 새 버전', () => {
  const same = [{ version: 'v1.2', effective: '2026-01-01' }, { version: 'v1.10', effective: '2026-01-01' }];
  assert.equal(sortVersions(same)[0].version, 'v1.10');
});

test('KST 날짜: UTC 15:00이 다음 날 0시', () => {
  assert.equal(todayKST(Date.parse('2026-09-30T14:59:59Z')), '2026-09-30');
  assert.equal(todayKST(Date.parse('2026-09-30T15:00:00Z')), '2026-10-01');
});

test('베타: 최신은 버전 번호가 큰 것(v0.10 > v0.9)', () => {
  assert.deepEqual(sortBeta([{ version: 'v0.9' }, { version: 'v0.10' }]).map((v) => v.version), ['v0.10', 'v0.9']);
});

test('베타 sync 대상: 게시된 같은 버전은 건드리지 않고, 새 버전은 beta/<문서>/<버전>.md draft로', () => {
  const pub = { status: 'published', version: 'v0.9', sha256: 'a' };
  assert.deepEqual(pickBetaTarget('terms', 'v0.9', 'a', pub), { path: 'src/content/legal/beta/terms.md', action: 'same' });
  assert.equal(pickBetaTarget('terms', 'v0.9', 'b', pub).action, 'drift');
  assert.deepEqual(pickBetaTarget('terms', 'v0.10', 'c', pub), { path: 'src/content/legal/beta/terms/v0.10.md', action: 'write' });
  assert.equal(pickBetaTarget('terms', 'v0.10', 'c', pub, () => true).action, 'skip');
  assert.equal(pickBetaTarget('terms', 'v0.9', 'a', null).path, 'src/content/legal/beta/terms.md');
});
