import './loadFonts';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  bg: '#0a0a0c',
  ink: '#f5f5f2',
  inkDim: '#9a9a9c',
  accent: '#e0483e',
  accentGreen: '#3ecf8e',
  gold: '#d8b45a',
  panel: '#17171a',
  line: '#2c2c30',
};

// Pretendard는 이 프로젝트에 실제로 로드된 적이 없어 시스템 폰트가 없으면 조용히
// 폴백되던 문제가 있었다. Noto Sans KR을 public/fonts의 로컬 파일로 명시적으로 로드해서
// 렌더 환경과 무관하게 항상 같은 한글 폰트가 보이도록 보장한다(로드 방식은 loadFonts.ts).
export const FONT_FAMILY = '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif';

export const sec = (seconds: number) => Math.round(seconds * FPS);
