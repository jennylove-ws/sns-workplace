import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * 두 줄 비교 차트: 들쭉날쭉한 선(예: 비트코인) vs 거의 평평한 선(스테이블코인).
 * 왼쪽에서 오른쪽으로 그려지며 각 줄 끝에 라벨을 붙인다.
 */
export const CompareChart: React.FC<{
  durationInFrames: number;
  width?: number;
  height?: number;
  volatileLabel?: string;
  flatLabel?: string;
}> = ({
  durationInFrames,
  width = 1400,
  height = 560,
  volatileLabel = '비트코인',
  flatLabel = '스테이블코인',
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const volatilePoints = [0.2, 0.75, 0.35, 0.85, 0.25, 0.7, 0.15, 0.6, 0.3, 0.5];
  const flatPoints = [0.5, 0.52, 0.48, 0.51, 0.49, 0.5, 0.51, 0.49, 0.5, 0.5];

  const toXY = (values: number[]) => {
    const n = Math.max(1, Math.floor(reveal * (values.length - 1)));
    return values.slice(0, n + 1).map((v, i) => ({
      x: (i / (values.length - 1)) * width,
      y: (1 - v) * height * 0.7 + height * 0.1,
    }));
  };

  const toPath = (pts: {x: number; y: number}[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const volatileXY = toXY(volatilePoints);
  const flatXY = toXY(flatPoints);
  const volatileEnd = volatileXY[volatileXY.length - 1];
  const flatEnd = flatXY[flatXY.length - 1];

  return (
    <svg width={width + 220} height={height} style={{overflow: 'visible'}}>
      <path d={toPath(volatileXY)} fill="none" stroke={COLORS.gold} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={toPath(flatXY)} fill="none" stroke={COLORS.accentGreen} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      {reveal >= 0.98 && (
        <>
          <text x={volatileEnd.x + 20} y={Math.min(volatileEnd.y, flatEnd.y) - 22} fontFamily={FONT_FAMILY} fontSize={34} fontWeight={700} fill={COLORS.gold}>
            {volatileLabel}
          </text>
          <text x={flatEnd.x + 20} y={Math.max(volatileEnd.y, flatEnd.y) + 40} fontFamily={FONT_FAMILY} fontSize={34} fontWeight={700} fill={COLORS.accentGreen}>
            {flatLabel}
          </text>
        </>
      )}
    </svg>
  );
};
