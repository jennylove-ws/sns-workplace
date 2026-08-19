import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';

const BAR_COUNT = 7;

/**
 * 플레이리스트 앱에서 보이는 것 같은 세로 이퀄라이저 막대.
 * AnimatedWaveform(사인파)과는 다른 톤의 보조 동적 요소 — 같은 효과 반복을
 * 피하기 위해 상황에 맞게 골라 쓴다. 전체 화면을 덮지 않는 작은 요소이므로
 * 호출부에서 위치를 지정해 배치한다.
 */
export const AudioBars: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}> = ({width = 200, height = 64, color = COLORS.gold, opacity = 0.55}) => {
  const frame = useCurrentFrame();
  const gap = 6;
  const barW = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap,
        width,
        height,
        opacity,
      }}
    >
      {Array.from({length: BAR_COUNT}).map((_, i) => {
        const phase = i * 0.9;
        const speed = 0.16 + (i % 3) * 0.05;
        const t = (Math.sin(frame * speed + phase) + 1) / 2; // 0..1
        const h = Math.max(6, height * (0.15 + t * 0.85));
        return (
          <div
            key={i}
            style={{
              width: barW,
              height: h,
              background: color,
              borderRadius: barW / 2,
            }}
          />
        );
      })}
    </div>
  );
};
