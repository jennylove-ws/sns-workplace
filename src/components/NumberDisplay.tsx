import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

export const formatKoreanCount = (n: number): string => {
  if (n >= 1_0000_0000_0000) return `${Math.round(n / 1_0000_0000_0000)}조`;
  if (n >= 1_0000_0000) return `${Math.round(n / 1_0000_0000)}억`;
  if (n >= 1_0000) return `${Math.round(n / 1_0000)}만`;
  return `${Math.round(n)}`;
};

/**
 * 값이 프레임 지점마다 뚝뚝 꺾이며 바뀌는 디스플레이.
 * ($1.00 → $0.68 → $0.30 → $0.02 처럼 급락하는 느낌)
 */
export const StepValue: React.FC<{
  steps: {value: string; atFrame: number}[];
  color?: string;
  fontSize?: number;
  shake?: boolean;
}> = ({steps, color = COLORS.ink, fontSize = 220, shake = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let current = steps[0];
  let changedAt = steps[0].atFrame;
  for (const s of steps) {
    if (frame >= s.atFrame) {
      current = s;
      changedAt = s.atFrame;
    }
  }

  const sinceChange = frame - changedAt;
  const punch = shake
    ? spring({
        frame: sinceChange,
        fps,
        config: {damping: 9, stiffness: 260, mass: 0.5},
        durationInFrames: 10,
      })
    : 1;
  const scale = 1 + (1 - punch) * 0.25;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 800,
        color,
        transform: `scale(${scale})`,
        letterSpacing: -2,
      }}
    >
      {current.value}
    </div>
  );
};

/**
 * 미친 속도로 돌아가는 숫자 카운터 (오도미터 느낌). from→to까지 지수적으로
 * 가속했다가 끝에서 멈춘다.
 */
export const SpinningCounter: React.FC<{
  from: number;
  to: number;
  durationInFrames: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
}> = ({
  from,
  to,
  durationInFrames,
  prefix = '',
  suffix = '개',
  fontSize = 130,
  color = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // ease-out-expo: 처음엔 느리게 시작해서 순식간에 폭증
  const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const value = from + (to - from) * eased;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 800,
        color,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}
      {formatKoreanCount(value)}
      {suffix}
    </div>
  );
};
