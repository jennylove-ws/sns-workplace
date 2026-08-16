import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

export type CenterLine = {text: string; startFrame: number; endFrame: number};

/**
 * 화면 정중앙에 흰 글씨가 한 줄씩 나타났다 사라지는 연출.
 * (검은 배경 위 강조 문구용 — 하단 자막과는 별도 트랙)
 */
export const CenterLines: React.FC<{
  lines: CenterLine[];
  fontSize?: number;
  bold?: boolean;
}> = ({lines, fontSize = 58, bold = true}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 220px',
      }}
    >
      {lines.map((line, i) => {
        const opacity = interpolate(
          frame,
          [line.startFrame, line.startFrame + 10, line.endFrame - 10, line.endFrame],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        if (opacity <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontFamily: FONT_FAMILY,
              fontSize,
              fontWeight: bold ? 800 : 500,
              color: COLORS.ink,
              textAlign: 'center',
              lineHeight: 1.5,
              opacity,
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};
