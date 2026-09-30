// 내부 링크는 모두 이 함수로 만들어 base를 따르게 합니다. href('/support/') → '/heelo-web/support/'
export const href = (path) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
