import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

type Step = {label: string; value: string; color: string};

/**
 * 차익거래 흐름을 단계별로 보여주는 정보성 모션그래픽.
 * 각 단계가 순서대로 팝인되고, 화살표로 이어지며, 마지막 수익 단계는
 * 강조 애니메이션으로 튄다.
 */
export const ArbitrageFlow: React.FC<{
  durationInFrames: number;
  steps?: Step[];
}> = ({
  durationInFrames,
  steps = [
    {label: '시장 매수', value: '$0.98', color: COLORS.ink},
    {label: '자판기 투입', value: '→', color: COLORS.inkDim},
    {label: '루나 획득', value: '$1.00', color: COLORS.gold},
    {label: '시장 판매', value: '+$0.02', color: COLORS.accentGreen},
  ],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stepWindow = durationInFrames / steps.length;

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
      {steps.map((step, i) => {
        const appearAt = i * stepWindow * 0.8;
        const localFrame = frame - appearAt;
        const pop = spring({
          frame: localFrame,
          fps,
          config: {damping: 12, stiffness: 180, mass: 0.6},
          durationInFrames: 20,
        });
        const opacity = interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const isLast = i === steps.length - 1;
        const finalPulse = isLast
          ? 1 + Math.max(0, Math.sin(Math.max(0, localFrame - 20) / 8)) * 0.08
          : 1;

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                style={{
                  width: 46,
                  height: 4,
                  background: COLORS.line,
                  opacity,
                  borderRadius: 2,
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                opacity,
                transform: `scale(${pop * finalPulse})`,
                background: isLast ? 'rgba(62,207,142,0.12)' : COLORS.panel,
                border: `2px solid ${isLast ? COLORS.accentGreen : COLORS.line}`,
                borderRadius: 16,
                padding: '22px 26px',
                minWidth: 168,
              }}
            >
              <span style={{fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: 600, color: COLORS.inkDim}}>
                {step.label}
              </span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: step.color}}>
                {step.value}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
