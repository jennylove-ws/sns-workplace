import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

/**
 * 핵심 비유: 자판기(왼쪽=파쇄기/투입, 오른쪽=인쇄기/배출).
 * phase: 'idle' | 'ust-in' | 'luna-in' 으로 어느 방향 교환이 일어나는지 표시.
 * tokenAtFrame 기준으로 토큰이 빨려들어가고 반대쪽에서 새 토큰이 튀어나온다.
 */
export const VendingMachine: React.FC<{
  phase: 'idle' | 'ust-in' | 'luna-in';
  actionAtFrame?: number;
  actionDurationFrames?: number;
  leftLabel?: string;
  rightLabel?: string;
}> = ({
  phase,
  actionAtFrame = 0,
  actionDurationFrames = 24,
  leftLabel = 'UST 투입',
  rightLabel = 'LUNA 투입',
}) => {
  const frame = useCurrentFrame();
  const local = frame - actionAtFrame;

  const active = phase !== 'idle';
  const inbound = phase === 'ust-in'; // UST 투입 -> LUNA 배출
  const t = interpolate(local, [0, actionDurationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const inX = interpolate(t, [0, 0.45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outX = interpolate(t, [0.5, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flash = interpolate(
    t,
    [0.4, 0.5, 0.62],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const bodyW = 760;
  const bodyH = 460;

  return (
    <div style={{position: 'relative', width: bodyW, height: bodyH + 90}}>
      {/* 본체 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: bodyW,
          height: bodyH,
          borderRadius: 20,
          background: COLORS.panel,
          border: `4px solid ${COLORS.line}`,
        }}
      >
        {/* 중앙 플래시(파쇄+인쇄 순간) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            background: COLORS.gold,
            opacity: flash * 0.35,
          }}
        />

        {/* 왼쪽 슬롯 */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 60,
            width: 300,
            height: 200,
            borderRadius: 12,
            border: `3px dashed ${COLORS.line}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              color: COLORS.inkDim,
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {leftLabel}
          </span>
        </div>

        {/* 오른쪽 슬롯 */}
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 60,
            width: 300,
            height: 200,
            borderRadius: 12,
            border: `3px dashed ${COLORS.line}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              color: COLORS.inkDim,
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {rightLabel}
          </span>
        </div>

        {/* 투입되는 토큰 */}
        {active && (
          <div
            style={{
              position: 'absolute',
              top: 145,
              left: inbound ? 190 - inX * 40 : bodyW - 190 + inX * 40,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: inbound ? COLORS.accentGreen : COLORS.accent,
              opacity: 1 - inX * 0.9,
              transform: `scale(${1 - inX * 0.6})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              color: '#0a0a0c',
              fontSize: 26,
            }}
          >
            {inbound ? 'UST' : 'LUNA'}
          </div>
        )}

        {/* 배출되는 토큰 */}
        {active && outX > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 380 - outX * 260,
              left: inbound ? bodyW - 190 : 190,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: inbound ? COLORS.accent : COLORS.accentGreen,
              opacity: outX,
              transform: `scale(${0.4 + outX * 0.6})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: 800,
              color: '#0a0a0c',
              fontSize: 26,
            }}
          >
            {inbound ? 'LUNA' : 'UST'}
          </div>
        )}

        {/* 안내판 */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_FAMILY,
            color: COLORS.gold,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          UST 1개 = 1달러어치 LUNA
        </div>
      </div>

      {/* 다리 */}
      <div
        style={{
          position: 'absolute',
          top: bodyH,
          left: 60,
          width: 30,
          height: 70,
          background: COLORS.line,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: bodyH,
          right: 60,
          width: 30,
          height: 70,
          background: COLORS.line,
        }}
      />
    </div>
  );
};
