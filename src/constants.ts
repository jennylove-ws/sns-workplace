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

export const FONT_FAMILY =
  '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

export const sec = (seconds: number) => Math.round(seconds * FPS);
