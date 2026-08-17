import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * "판다"(소유권만 이동, 총량 불변) vs "태운다"(총량 감소) 를 대비해서
 * 보여주는 정보성 모션그래픽. 토큰이 움직이는 애니메이션 + 발행량 카운터.
 */
export const SupplyLedger: React.FC<{
  mode: 'sell' | 'burn';
  durationInFrames: number;
  startSupply?: number;
}> = ({mode, durationInFrames, startSupply = 1000}) => {
  const frame = useCurrentFrame();
  const moveT = interpolate(frame, [10, durationInFrames * 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dissolve = mode === 'burn'
    ? interpolate(frame, [durationInFrames * 0.45, durationInFrames * 0.62], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const supplyNow = mode === 'burn'
    ? Math.round(
        interpolate(
          frame,
          [durationInFrames * 0.55, durationInFrames * 0.75],
          [startSupply, startSupply - 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        )
      )
    : startSupply;

  const tokenX = -260 + moveT * 520;
  const tokenY = mode === 'burn' ? -moveT * 40 : 0;
  const tokenScale = mode === 'burn' ? 1 - moveT * 0.4 : 1;

  const nodeStyle: React.CSSProperties = {
    width: 90,
    height: 90,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontWeight: 800,
    fontSize: 20,
    color: COLORS.ink,
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48}}>
      <div style={{fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: mode === 'burn' ? COLORS.accent : COLORS.accentGreen}}>
        {mode === 'burn' ? '태운다 (소각)' : '판다 (양도)'}
      </div>

      <div style={{position: 'relative', width: 560, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{...nodeStyle, background: COLORS.panel, border: `2px solid ${COLORS.line}`}}>나</div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: mode === 'burn' ? COLORS.accent : COLORS.gold,
            opacity: dissolve,
            transform: `translate(calc(-50% + ${tokenX}px), calc(-50% + ${tokenY}px)) scale(${tokenScale})`,
          }}
        />
        {mode === 'burn' ? (
          <div
            style={{
              ...nodeStyle,
              background: 'radial-gradient(circle, #000 40%, #1c1c20 100%)',
              border: `2px dashed ${COLORS.accent}`,
              color: COLORS.accent,
            }}
          >
            소각
          </div>
        ) : (
          <div style={{...nodeStyle, background: COLORS.panel, border: `2px solid ${COLORS.line}`}}>남</div>
        )}
      </div>

      <div style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.inkDim}}>
        총 발행량{' '}
        <span style={{color: mode === 'burn' ? COLORS.accent : COLORS.accentGreen, fontWeight: 800}}>
          {supplyNow.toLocaleString('ko-KR')}개
        </span>
      </div>
    </div>
  );
};
