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

  // 아주 짧은 자막(예: "어?")은 FADE*2보다 길이가 짧아 페이드 인/아웃
  // 지점이 역전될 수 있으므로, interpolate가 요구하는 단조 증가를
  // 지키도록 절반 길이보다 살짝 더 작게 눌러준다.
  const duration = active.endFrame - active.startFrame;
  const fade = Math.max(0, Math.min(FADE, duration / 2 - 0.01));
  const fadeIn = active.startFrame + fade;
  const fadeOut = active.endFrame - fade;

  const opacity = interpolate(
    frame,
    [active.startFrame, fadeIn, fadeOut, active.endFrame],
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
