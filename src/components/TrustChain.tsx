import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

type Link = {label: string; sub?: string};

/**
 * "UST는 루나가 받치고, 루나는 믿음이 받친다" 처럼 위에서 아래로 쌓인
 * 의존 관계를 보여주는 체인 다이어그램. mode="shaking"이면 아래쪽(맨 마지막
 * 링크)부터 흔들림이 위로 전달되는 걸 보여준다.
 */
export const TrustChain: React.FC<{
  links: Link[];
  mode?: 'stable' | 'shaking';
}> = ({links, mode = 'stable'}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {links.map((link, i) => {
        const appearAt = i * 12;
        const opacity = interpolate(frame, [appearAt, appearAt + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        let shakeX = 0;
        if (mode === 'shaking') {
          // 맨 아래(마지막) 링크가 가장 크게 흔들리고, 위로 갈수록 감쇠되어 전달된다
          const depthFromBottom = links.length - 1 - i;
          const amplitude = Math.max(0, 10 - depthFromBottom * 3.2);
          const shakeStart = 40 + depthFromBottom * 10;
          const shakeT = Math.max(0, frame - shakeStart);
          shakeX = Math.sin(shakeT / 3) * amplitude * Math.min(1, shakeT / 15);
        }

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  width: 4,
                  height: 36,
                  background: COLORS.line,
                  opacity,
                }}
              />
            )}
            <div
              style={{
                opacity,
                transform: `translateX(${shakeX}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                background: COLORS.panel,
                border: `2px solid ${mode === 'shaking' && i === links.length - 1 ? COLORS.accent : COLORS.line}`,
                borderRadius: 14,
                padding: '20px 44px',
                minWidth: 220,
              }}
            >
              <span style={{fontFamily: FONT_FAMILY, fontSize: 38, fontWeight: 800, color: COLORS.ink}}>
                {link.label}
              </span>
              {link.sub && (
                <span style={{fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: 600, color: COLORS.inkDim}}>
                  {link.sub}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
