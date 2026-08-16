import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

export type SubtitleLine = {
  text: string;
  startFrame: number;
  endFrame: number;
  emphasis?: boolean;
};

const FADE = 6;

export const Subtitle: React.FC<{lines: SubtitleLine[]}> = ({lines}) => {
  const frame = useCurrentFrame();
  const active = lines.find(
    (l) => frame >= l.startFrame && frame < l.endFrame
  );

  if (!active) return null;

  const opacity = interpolate(
    frame,
    [
      active.startFrame,
      active.startFrame + FADE,
      active.endFrame - FADE,
      active.endFrame,
    ],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        padding: '0 160px',
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: active.emphasis ? 54 : 44,
          fontWeight: active.emphasis ? 800 : 600,
          color: COLORS.ink,
          textAlign: 'center',
          lineHeight: 1.4,
          textShadow:
            '0 2px 10px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)',
          background: 'rgba(0,0,0,0.32)',
          borderRadius: 14,
          padding: '10px 28px',
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
