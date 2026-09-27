import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPreview } from '../scripts/sync-legal-preview.mjs';

test('검토 표지 변환, 쟁점 절·주석 삭제, 자리표시는 유지', () => {
  const md = [
    '<!-- 서비스 이용약관 · 버전 v13 · 시행일 [시행일] -->',
    '',
    '# 1. 서비스 이용약관',
    '회사는 [사업자 정보: 상호]입니다. 7일 안에 환불해요 [검토: 환불 방식].',
    '| 항목 | 기간 (검토용 주석: 확인 중 — [개발 확인]) |',
    '보관 [개발 확인: 서울 리전] 위탁 [DPA 확인] 시행 [시행일]',
    '&#91;검토: [메일 서비스 사업자]가 국외면 행 추가]',
    '',
    '### 법률 검토 쟁점 — 서비스 이용약관',
    '1. [검토: 비공개 설명]',
  ].join('\n');
  const { body, count } = toPreview(md);
  assert.equal(body, [
    '# 1. 서비스 이용약관',
    '회사는 [사업자 정보: 상호]입니다. 7일 안에 환불해요 (검토 중).',
    '| 항목 | 기간 |',
    '보관 (확인 중) 위탁 (확인 중) 시행 [시행일]',
    '(검토 중)',
    '',
  ].join('\n'));
  assert.deepEqual(count, { 머리주석: 1, 쟁점절: 1, 검토용주석: 1, 검토: 2, 확인: 2 });
});
