import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * 텅 빈 금고 문이 쾅 열리는 연출. openAtFrame 이전엔 닫혀 있다가
 * 이후 빠르게(스프링성 오버슈트) 열리며 안쪽의 먼지 텍스트가 드러난다.
 */
export const VaultDoor: React.FC<{
  openAtFrame?: number;
  openDurationFrames?: number;
  interiorText?: string;
}> = ({openAtFrame = 0, openDurationFrames = 14, interiorText = '먼지뿐'}) => {
  const frame = useCurrentFrame();
  const local = frame - openAtFrame;

  const doorAngle = interpolate(
    local,
    [0, openDurationFrames * 0.7, openDurationFrames],
    [0, -108, -95],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const interiorOpacity = interpolate(
    local,
    [openDurationFrames * 0.5, openDurationFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'relative',
        width: 640,
        height: 640,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 금고 내부 */}
      <div
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: '#050506',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: interiorOpacity,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.inkDim,
            letterSpacing: 4,
          }}
        >
          {interiorText}
        </span>
      </div>

      {/* 금고 테두리 */}
      <div
        style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          border: `18px solid ${COLORS.panel}`,
          boxSizing: 'border-box',
        }}
      />

      {/* 금고 문 */}
      <div
        style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          transformOrigin: '0% 50%',
          transform: `rotateY(${doorAngle}deg)`,
          background:
            'radial-gradient(circle at 35% 35%, #3a3a40, #1c1c20 70%)',
          border: `10px solid ${COLORS.line}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `8px solid ${COLORS.gold}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};
