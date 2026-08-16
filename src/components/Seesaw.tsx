import React from 'react';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * 시소 비유: balance -1(왼쪽이 내려감) ~ 1(오른쪽이 내려감).
 * 애니메이션은 호출부에서 interpolate로 balance 값을 만들어 프레임마다 넘겨준다.
 */
export const Seesaw: React.FC<{
  balance: number; // -1..1
  leftLabel?: string;
  rightLabel?: string;
}> = ({balance, leftLabel = '', rightLabel = ''}) => {
  const angle = balance * 16; // degrees
  const plankW = 640;
  const plankH = 22;

  return (
    <div
      style={{
        position: 'relative',
        width: plankW + 80,
        height: 320,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* 받침대 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '70px solid transparent',
          borderRight: '70px solid transparent',
          borderBottom: `140px solid ${COLORS.panel}`,
        }}
      />

      {/* 판자 */}
      <div
        style={{
          position: 'absolute',
          bottom: 138,
          left: '50%',
          width: plankW,
          height: plankH,
          background: COLORS.line,
          borderRadius: 6,
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: -70,
            fontFamily: FONT_FAMILY,
            color: COLORS.ink,
            fontSize: 30,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {leftLabel}
        </div>
        <div
          style={{
            position: 'absolute',
            right: 10,
            top: -70,
            fontFamily: FONT_FAMILY,
            color: COLORS.ink,
            fontSize: 30,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {rightLabel}
        </div>
      </div>
    </div>
  );
};
