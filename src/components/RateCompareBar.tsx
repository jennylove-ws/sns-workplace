import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

type Bar = {label: string; value: number; display: string; color: string};

/** 막대 두 개로 이자율 같은 수치를 비교하는 정보그래픽. 막대가 자라나며 값이 뜬다. */
export const RateCompareBar: React.FC<{
  bars: Bar[];
  maxValue: number;
  durationInFrames: number;
  footnote?: string;
}> = ({bars, maxValue, durationInFrames, footnote}) => {
  const frame = useCurrentFrame();
  const growT = interpolate(frame, [10, durationInFrames * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const footnoteOpacity = interpolate(
    frame,
    [durationInFrames * 0.65, durationInFrames * 0.8],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const maxBarHeight = 420;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 90, height: maxBarHeight}}>
        {bars.map((bar, i) => {
          const h = (bar.value / maxValue) * maxBarHeight * growT;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: bar.color}}>
                {bar.display}
              </span>
              <div
                style={{
                  width: 130,
                  height: Math.max(4, h),
                  background: bar.color,
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <span style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>
      {footnote && (
        <div
          style={{
            opacity: footnoteOpacity,
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 800,
            color: COLORS.accent,
          }}
        >
          {footnote}
        </div>
      )}
    </div>
  );
};
