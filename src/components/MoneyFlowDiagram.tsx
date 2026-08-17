import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * 예금자 → 은행 → 대출자 구조의 돈 흐름을 보여준다. 원금은 한쪽 방향,
 * 이자는 반대 방향으로 흐르는 걸 화살표 두 줄로 표현.
 */
export const MoneyFlowDiagram: React.FC<{depositorLabel?: string; bankLabel?: string; borrowerLabel?: string}> = ({
  depositorLabel = '예금자',
  bankLabel = '은행',
  borrowerLabel = '대출자',
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flow = (frame % 60) / 60;

  const nodeStyle: React.CSSProperties = {
    width: 200,
    height: 110,
    borderRadius: 16,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.ink,
    opacity,
  };

  const Arrow: React.FC<{label: string; color: string; reverse?: boolean}> = ({label, color, reverse}) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity}}>
      <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color}}>{label}</span>
      <div style={{position: 'relative', width: 160, height: 4, background: COLORS.line, borderRadius: 2}}>
        <div
          style={{
            position: 'absolute',
            top: -6,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: color,
            left: `${(reverse ? 1 - flow : flow) * 90}%`,
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={nodeStyle}>{depositorLabel}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Arrow label="예금" color={COLORS.gold} />
          <Arrow label="이자" color={COLORS.accentGreen} reverse />
        </div>
        <div style={nodeStyle}>{bankLabel}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <Arrow label="대출" color={COLORS.gold} />
          <Arrow label="이자" color={COLORS.accentGreen} reverse />
        </div>
        <div style={nodeStyle}>{borrowerLabel}</div>
      </div>
      <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
        이자를 만들어내는 건 대출자
      </div>
    </div>
  );
};
