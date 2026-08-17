import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';

type WaveConfig = {amplitude: number; wavelength: number; speed: number; yOffset: number; color: string; opacity: number; strokeWidth: number};

/**
 * 배경에 깔리는 움직이는 파형 라인. 텍스트만 오래 떠 있는 정적인 구간에
 * 시각적 리듬을 더하기 위한 장식용 모션그래픽.
 */
export const AnimatedWaveform: React.FC<{
  width?: number;
  height?: number;
  waves?: WaveConfig[];
}> = ({
  width = 1920,
  height = 1080,
  waves = [
    {amplitude: 36, wavelength: 420, speed: 1.4, yOffset: 0.32, color: COLORS.gold, opacity: 0.35, strokeWidth: 3},
    {amplitude: 24, wavelength: 300, speed: -1.9, yOffset: 0.68, color: COLORS.accentGreen, opacity: 0.28, strokeWidth: 3},
    {amplitude: 50, wavelength: 560, speed: 0.9, yOffset: 0.5, color: COLORS.line, opacity: 0.5, strokeWidth: 2},
  ],
}) => {
  const frame = useCurrentFrame();

  const buildPath = (w: WaveConfig) => {
    const baseY = height * w.yOffset;
    const points: string[] = [];
    const step = 16;
    for (let x = 0; x <= width; x += step) {
      const phase = (x / w.wavelength) * Math.PI * 2 + (frame * w.speed) / 20;
      const y = baseY + Math.sin(phase) * w.amplitude;
      points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', inset: 0}}
    >
      {waves.map((w, i) => (
        <path key={i} d={buildPath(w)} fill="none" stroke={w.color} strokeWidth={w.strokeWidth} opacity={w.opacity} />
      ))}
    </svg>
  );
};
