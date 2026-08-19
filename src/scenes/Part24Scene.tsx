import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {CrashChart} from '../components/CrashChart';
import {AnimatedWaveform} from '../components/AnimatedWaveform';

// 파트24 오디오 구간(1046.16s~1092.88s) = 1402프레임
export const PART24_DURATION = 1402;

const B = {
  marketStart: 0,
  realWorldStart: 563, // 18.77s
  lookSameStart: 900, // +11.23s
  notAdviceStart: 1147, // +8.23s
  end: PART24_DURATION, // +8.47s
};

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
);

const Caption: React.FC<{text: string; top?: string | number; color?: string}> = ({
  text,
  top = 130,
  color = COLORS.gold,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        fontFamily: FONT_FAMILY,
        fontSize: 34,
        fontWeight: 700,
        color,
      }}
    >
      {text}
    </div>
  );
};

const GROWTH_POINTS = [
  {x: 0, y: 0.1},
  {x: 0.3, y: 0.25},
  {x: 0.5, y: 0.55},
  {x: 0.62, y: 0.92},
];

const MarketGrew: React.FC = () => {
  const frame = useCurrentFrame();
  const qOpacity = interpolate(frame, [0, 20], [1, 0.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const {fps} = useVideoConfig();
  const oppositeReveal = spring({frame: frame - 99, fps, config: {damping: 13, stiffness: 160}, durationInFrames: 20});
  const chartLocal = frame - 121;
  const statOpacity = interpolate(frame, [316, 341], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const footerOpacity = interpolate(frame, [430, 455], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="이 사건 이후, 스테이블코인 시장은 사라졌을까요?" color={COLORS.inkDim} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div
            style={{
              opacity: oppositeReveal,
              transform: `scale(${0.85 + oppositeReveal * 0.15})`,
              fontFamily: FONT_FAMILY,
              fontSize: 70,
              fontWeight: 800,
              color: COLORS.accentGreen,
            }}
          >
            반대입니다
          </div>
          {chartLocal > 0 && (
            <CrashChart
              points={GROWTH_POINTS}
              durationInFrames={180}
              width={640}
              height={260}
              color={COLORS.accentGreen}
              labelFormatter={() => '3,217억 달러'}
            />
          )}
          <div style={{opacity: statOpacity, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.ink}}>
            2026년 1월, 한 달 이체량 10조 달러+
          </div>
          <div style={{opacity: footerOpacity, fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
            테라 붕괴(2022.4) 이후 가장 큰 규모
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const USES = [
  {atFrame: 98, icon: '💳', label: '결제'},
  {atFrame: 130, icon: '💸', label: '송금'},
  {atFrame: 162, icon: '🏦', label: '기관 정산'},
];

const RealWorldUse: React.FC = () => {
  const frame = useCurrentFrame();
  const conclusionOpacity = interpolate(frame, [212, 237], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="지금은 거래소 안에만 있지 않다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <div style={{display: 'flex', gap: 50}}>
            {USES.map((u) => {
              const local = frame - u.atFrame;
              const op = interpolate(local, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const scale = interpolate(local, [0, 15], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div
                  key={u.label}
                  style={{
                    opacity: op,
                    transform: `scale(${scale})`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    padding: '24px 30px',
                    borderRadius: 16,
                    background: COLORS.panel,
                    border: `1px solid ${COLORS.line}`,
                  }}
                >
                  <span style={{fontSize: 46}}>{u.icon}</span>
                  <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.ink}}>
                    {u.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              opacity: conclusionOpacity,
              fontFamily: FONT_FAMILY,
              fontSize: 30,
              fontWeight: 800,
              color: COLORS.gold,
              textAlign: 'center',
            }}
          >
            코인 하는 사람들만의 얘기가 아니게 됐다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const CARD_BACKINGS = ['💵', '📜', '❓'];

const LookSame: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [169, 199], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card: React.CSSProperties = {
    width: 180,
    height: 240,
    borderRadius: 16,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="겉보기엔 다 똑같다 — 뭐가 뒤에 있는지는 열어봐야 안다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', gap: 40}}>
          {CARD_BACKINGS.map((backing, i) => (
            <div key={i} style={card}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 1 - flip,
                  fontFamily: FONT_FAMILY,
                  fontSize: 44,
                  fontWeight: 800,
                  color: COLORS.ink,
                }}
              >
                $1.00
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: flip,
                }}
              >
                <span style={{fontSize: 50}}>{backing}</span>
                <span style={{fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: 700, color: COLORS.gold}}>?</span>
              </div>
            </div>
          ))}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const NotAdvice: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [90, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, maxWidth: 1300}}>
        <div
          style={{
            opacity: op1,
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.inkDim,
            textAlign: 'center',
          }}
        >
          이 영상은 특정 자산을 사라거나 팔라는 얘기가 아닙니다
        </div>
        <div
          style={{
            opacity: op2,
            fontFamily: FONT_FAMILY,
            fontSize: 42,
            fontWeight: 800,
            color: COLORS.ink,
            textAlign: 'center',
          }}
        >
          돈이 어떤 약속을 믿고 움직였는지 따라가 봤습니다
        </div>
      </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part24Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.marketStart} durationInFrames={B.realWorldStart - B.marketStart}>
        <MarketGrew />
      </Sequence>

      <Sequence from={B.realWorldStart} durationInFrames={B.lookSameStart - B.realWorldStart}>
        <RealWorldUse />
      </Sequence>

      <Sequence from={B.lookSameStart} durationInFrames={B.notAdviceStart - B.lookSameStart}>
        <LookSame />
      </Sequence>

      <Sequence from={B.notAdviceStart} durationInFrames={B.end - B.notAdviceStart}>
        <NotAdvice />
      </Sequence>
    </AbsoluteFill>
  );
};
