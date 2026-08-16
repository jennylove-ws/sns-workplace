import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

export const TitleCard: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({title = '돈의 궤적', subtitle = '돈이 움직인 사건을 추적한다'}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, 20], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 96,
          fontWeight: 800,
          color: COLORS.ink,
          letterSpacing: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: FONT_FAMILY,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.inkDim,
          letterSpacing: 2,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
