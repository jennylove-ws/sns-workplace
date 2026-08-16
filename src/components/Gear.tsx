import React from 'react';
import {COLORS} from '../constants';

/**
 * 톱니바퀴. rotationDeg는 호출부에서 프레임 기반으로 계산해 넘긴다
 * (가속/감속/역회전 등 연출 제어를 바깥에서 하기 위함).
 */
export const Gear: React.FC<{
  size?: number;
  teeth?: number;
  rotationDeg: number;
  color?: string;
}> = ({size = 220, teeth = 10, rotationDeg, color = COLORS.line}) => {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.72;
  const toothR = outerR * 0.92;
  const holeR = outerR * 0.28;

  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI * 2 * i) / (teeth * 2);
    const r = i % 2 === 0 ? toothR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  return (
    <svg
      width={size}
      height={size}
      style={{transform: `rotate(${rotationDeg}deg)`}}
    >
      <polygon points={points.join(' ')} fill={color} />
      <circle cx={cx} cy={cy} r={holeR} fill="#0a0a0c" />
    </svg>
  );
};
