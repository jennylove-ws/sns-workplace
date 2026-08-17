import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {SpinningCounter} from '../components/NumberDisplay';
import {CrashChart} from '../components/CrashChart';
import {TitleCard} from '../components/TitleCard';
import {SlideImage} from '../components/SlideImage';

// 파트17 오디오 구간(723.12s~774.84s) = 1552프레임
export const PART17_DURATION = 1552;

const B = {
  priceStart: 0,
  cycleStart: 383, // 12.77s
  brakeStart: 735, // +11.73s
  titleStart: 955, // +7.33s
  numbersStart: 1188, // +7.77s
  end: PART17_DURATION, // +12.13s
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

const PRICE_ROWS = [
  {atFrame: 0, price: '루나 $80', amount: '0.0125개'},
  {atFrame: 130, price: '루나 $1', amount: '1개'},
  {atFrame: 260, price: '루나 $0.01', amount: '100개'},
];

const PriceToPrint: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Caption text="UST 1달러어치를 주려면, 루나를 몇 개 찍어야 할까" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
          {PRICE_ROWS.map((row, i) => {
            const local = frame - row.atFrame;
            const opacity = interpolate(local, [0, 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const scale = interpolate(local, [0, 15], [0.85, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={row.price}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 40,
                  fontFamily: FONT_FAMILY,
                }}
              >
                <span style={{fontSize: 40, fontWeight: 700, color: COLORS.inkDim, width: 260}}>{row.price}</span>
                <span style={{fontSize: 30, color: COLORS.inkDim}}>→</span>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: i === 2 ? COLORS.accent : COLORS.gold,
                  }}
                >
                  {row.amount}
                </span>
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const CYCLE_LABELS = ['찍는다', '공급 ↑', '가격 ↓', '더 찍는다'];

const ViciousCycle: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // 시간이 지날수록 회전 속도가 빨라진다 (가속되는 악순환)
  const speed = interpolate(frame, [0, 350], [0.6, 3.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const angle = (frame * speed) % 360;
  const radius = 190;

  return (
    <AbsoluteFill>
      <Caption text="많이 찍으니까 더 떨어지고, 더 떨어지니까 또 찍는다" color={COLORS.accent} />
      <Centered>
        <div style={{position: 'relative', width: 460, height: 460, opacity}}>
          <svg width={460} height={460} style={{position: 'absolute', inset: 0}}>
            <circle cx={230} cy={230} r={radius} fill="none" stroke={COLORS.line} strokeWidth={3} />
          </svg>
          {CYCLE_LABELS.map((label, i) => {
            const a = ((angle + i * 90) * Math.PI) / 180;
            const x = 230 + radius * Math.sin(a);
            const y = 230 - radius * Math.cos(a);
            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: x - 60,
                  top: y - 24,
                  width: 120,
                  textAlign: 'center',
                  fontFamily: FONT_FAMILY,
                  fontSize: 26,
                  fontWeight: 800,
                  color: i % 2 === 0 ? COLORS.gold : COLORS.accent,
                  background: 'rgba(10,10,12,0.7)',
                  borderRadius: 10,
                  padding: '6px 4px',
                }}
              >
                {label}
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.inkDim,
            }}
          >
            🌀
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const BrakeGas: React.FC = () => {
  const frame = useCurrentFrame();
  const pressT = interpolate(frame % 60, [0, 25, 35, 60], [0, 1, 1, 0]);
  const pedal: React.CSSProperties = {
    width: 180,
    height: 60,
    borderRadius: 14,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 800,
    color: COLORS.ink,
  };
  return (
    <AbsoluteFill>
      <Caption text="브레이크를 밟았는데, 가속 페달이 같이 밟히는 구조" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <div style={{display: 'flex', gap: 60}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{...pedal, borderColor: COLORS.accentGreen, transform: `translateY(${pressT * 14}px)`}}>
                🛑 브레이크
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
              <div style={{...pedal, borderColor: COLORS.accent, transform: `translateY(${pressT * 14}px)`}}>
                🚀 가속
              </div>
            </div>
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.inkDim}}>
            멈출 방법이 시스템 안에 없었다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const DeathSpiralTitle: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [0, 30], [0, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_o0oe66o0oe66o0oe.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.12}
      />
      <AbsoluteFill style={{background: `rgba(10,10,12,${dim})`}} />
      <TitleCard title="죽음의 소용돌이" subtitle="Death Spiral" />
    </AbsoluteFill>
  );
};

const ThreeDaysNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const dayOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const footerOpacity = interpolate(frame, [280, 310], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="3일 동안 벌어진 일" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{opacity: dayOpacity, fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: COLORS.ink}}>
            공급량
          </div>
          <SpinningCounter from={1_000_000_000} to={6_000_000_000_000} durationInFrames={160} suffix="개" fontSize={110} />
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <CrashChart
              points={[
                {x: 0, y: 0.95},
                {x: 0.35, y: 0.5},
                {x: 0.58, y: 0.03},
              ]}
              durationInFrames={130}
              width={520}
              height={220}
              color={COLORS.accent}
              labelFormatter={() => '거의 $0'}
            />
          </div>
          <div style={{opacity: footerOpacity, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.gold}}>
            오프닝에서 보신 그 카운터가 바로 이겁니다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part17Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.priceStart} durationInFrames={B.cycleStart - B.priceStart}>
        <PriceToPrint />
      </Sequence>

      <Sequence from={B.cycleStart} durationInFrames={B.brakeStart - B.cycleStart}>
        <ViciousCycle />
      </Sequence>

      <Sequence from={B.brakeStart} durationInFrames={B.titleStart - B.brakeStart}>
        <BrakeGas />
      </Sequence>

      <Sequence from={B.titleStart} durationInFrames={B.numbersStart - B.titleStart}>
        <DeathSpiralTitle durationInFrames={B.numbersStart - B.titleStart} />
      </Sequence>

      <Sequence from={B.numbersStart} durationInFrames={B.end - B.numbersStart}>
        <ThreeDaysNumbers />
      </Sequence>
    </AbsoluteFill>
  );
};
