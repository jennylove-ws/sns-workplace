import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

export type ChartPoint = {x: number; y: number}; // normalized 0..1, y: 0=bottom 1=top

/**
 * 평평하다가 절벽처럼 수직으로 떨어지는 붕괴 차트.
 * points는 0..1 정규화 좌표 (x: 시간, y: 값, 1이 최고점).
 */
export const CrashChart: React.FC<{
  points: ChartPoint[];
  durationInFrames: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showLabel?: boolean;
  labelFormatter?: (y: number) => string;
}> = ({
  points,
  durationInFrames,
  width = 1400,
  height = 620,
  color = COLORS.accent,
  strokeWidth = 8,
  showLabel = true,
  labelFormatter = (y) => `$${(y * 80).toFixed(2)}`,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const toPx = (p: ChartPoint) => ({
    x: p.x * width,
    y: (1 - p.y) * height,
  });

  // reveal 위치까지만 그리기 위해 point들을 보간
  const visible: {x: number; y: number}[] = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].x <= reveal) {
      visible.push(toPx(points[i]));
    } else {
      if (i > 0) {
        const prev = points[i - 1];
        const cur = points[i];
        const segT =
          (reveal - prev.x) / (cur.x - prev.x || 1);
        const interpY = prev.y + (cur.y - prev.y) * segT;
        visible.push(toPx({x: reveal, y: interpY}));
      }
      break;
    }
  }

  const path = visible
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const last = visible[visible.length - 1];

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke={COLORS.line}
        strokeWidth={2}
      />
      {path && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {last && showLabel && (
        <g>
          <circle cx={last.x} cy={last.y} r={12} fill={color} />
          <text
            x={Math.min(last.x + 24, width - 160)}
            y={last.y + 10}
            fontFamily={FONT_FAMILY}
            fontSize={44}
            fontWeight={800}
            fill={color}
          >
            {labelFormatter(1 - last.y / height)}
          </text>
        </g>
      )}
    </svg>
  );
};
