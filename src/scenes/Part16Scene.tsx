import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {VendingMachine} from '../components/VendingMachine';
import {CrashChart} from '../components/CrashChart';
import {SlideImage} from '../components/SlideImage';

// 파트16 오디오 구간(674.4s~723.12s) = 1462프레임
export const PART16_DURATION = 1462;

const B = {
  panicStart: 0,
  heartStart: 289, // 9.63s
  vendingStart: 501, // +7.07s
  queueStart: 755, // +8.47s
  crashStart: 1065, // +10.33s
  cliffhangerStart: 1253, // +6.27s
  ruleStart: 1367, // +3.8s
  end: PART16_DURATION, // +3.17s
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

const PanicSelling: React.FC = () => {
  const frame = useCurrentFrame();
  const swapT = interpolate(frame, [10, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sellLocal = frame - 130;
  const sellT = interpolate(sellLocal, [0, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const box: React.CSSProperties = {
    width: 220,
    height: 120,
    borderRadius: 16,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    fontWeight: 800,
    color: COLORS.ink,
  };
  return (
    <AbsoluteFill>
      <Caption text="루나로 바꾼 순간, 바로 팔아버린다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={box}>UST</div>
            <div style={{position: 'relative', width: 120, height: 6, background: COLORS.line, borderRadius: 3}}>
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: `${swapT * 85}%`,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: COLORS.gold,
                }}
              />
            </div>
            <div style={{...box, borderColor: COLORS.gold}}>LUNA</div>
            <div
              style={{
                position: 'relative',
                width: 120,
                height: 6,
                background: COLORS.line,
                borderRadius: 3,
                opacity: sellLocal > 0 ? 1 : 0.25,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: `${sellT * 85}%`,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: COLORS.accent,
                }}
              />
            </div>
            <div style={{...box, borderColor: COLORS.accent, color: COLORS.accent}}>매도</div>
          </div>
          <div
            style={{
              opacity: sellT,
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.inkDim,
            }}
          >
            들고 있을 이유가 없다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const HeartOfEvent: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 15, 90, 105], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op2 = interpolate(frame, [110, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{position: 'relative', width: 1200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              position: 'absolute',
              opacity: op1,
              fontFamily: FONT_FAMILY,
              fontSize: 56,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            여기서 구조가 뒤집힌다
          </div>
          <div
            style={{
              position: 'absolute',
              opacity: op2,
              fontFamily: FONT_FAMILY,
              fontSize: 68,
              fontWeight: 800,
              color: COLORS.accent,
              textShadow: '0 2px 24px rgba(0,0,0,0.95)',
              textAlign: 'center',
            }}
          >
            이 사건의 심장입니다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const VendingRecap: React.FC = () => (
  <AbsoluteFill>
    <Caption text="평소엔 아무 문제 없었다 — 넣는 사람이 몇 없었으니까" />
    <Centered>
      <VendingMachine phase="ust-in" actionAtFrame={40} actionDurationFrames={40} leftLabel="UST 투입" rightLabel="LUNA 발행" />
    </Centered>
  </AbsoluteFill>
);

const QueueRush: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [10, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const counterOpacity = interpolate(frame, [140, 165], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_rh3jtcrh3jtcrh3j.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <div style={{position: 'absolute', top: '12%', left: 0, right: 0, textAlign: 'center', opacity: textOpacity}}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.gold,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 12,
            padding: '10px 28px',
          }}
        >
          지금은 모두가 그 앞에 줄을 섰다
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 210,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: counterOpacity,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 800,
            color: COLORS.accent,
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 12,
            padding: '10px 28px',
          }}
        >
          수억 개의 UST → 그만큼의 LUNA
        </span>
      </div>
    </AbsoluteFill>
  );
};

const SUPPLY_T_MAX = 220;
const PRICE_POINTS = [
  {x: 0, y: 0.95},
  {x: 0.4, y: 0.7},
  {x: 0.7, y: 0.4},
  {x: 1, y: 0.12},
];

const SupplyCrash: React.FC = () => {
  const frame = useCurrentFrame();
  const supplyT = interpolate(frame, [0, SUPPLY_T_MAX], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="공급은 늘고, 매도는 쏟아지고, 루나 가격은 주저앉는다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', alignItems: 'center', gap: 100}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
            <div style={{display: 'flex', alignItems: 'flex-end', height: 300}}>
              <div
                style={{
                  width: 110,
                  height: Math.max(6, 300 * supplyT),
                  background: COLORS.gold,
                  borderRadius: '8px 8px 0 0',
                }}
              />
            </div>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.gold}}>
              LUNA 공급량
            </span>
          </div>
          <CrashChart
            points={PRICE_POINTS}
            durationInFrames={SUPPLY_T_MAX}
            width={640}
            height={320}
            color={COLORS.accent}
            labelFormatter={() => '루나 ↓'}
          />
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const Cliffhanger: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [65, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div
            style={{
              opacity: op1,
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 700,
              color: COLORS.inkDim,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            여기까지는, 뭐 그럴 수 있다
          </div>
          <div
            style={{
              opacity: op2,
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.accent,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            진짜 미친 건, 그다음이다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const RuleRecap: React.FC = () => (
  <AbsoluteFill>
    <Caption text="자판기 규칙을 다시 봅시다" />
    <Centered>
      <VendingMachine phase="ust-in" actionAtFrame={20} actionDurationFrames={40} leftLabel="UST 1개" rightLabel="LUNA?" />
    </Centered>
  </AbsoluteFill>
);

export const Part16Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.panicStart} durationInFrames={B.heartStart - B.panicStart}>
        <PanicSelling />
      </Sequence>

      <Sequence from={B.heartStart} durationInFrames={B.vendingStart - B.heartStart}>
        <HeartOfEvent />
      </Sequence>

      <Sequence from={B.vendingStart} durationInFrames={B.queueStart - B.vendingStart}>
        <VendingRecap />
      </Sequence>

      <Sequence from={B.queueStart} durationInFrames={B.crashStart - B.queueStart}>
        <QueueRush durationInFrames={B.crashStart - B.queueStart} />
      </Sequence>

      <Sequence from={B.crashStart} durationInFrames={B.cliffhangerStart - B.crashStart}>
        <SupplyCrash />
      </Sequence>

      <Sequence from={B.cliffhangerStart} durationInFrames={B.ruleStart - B.cliffhangerStart}>
        <Cliffhanger />
      </Sequence>

      <Sequence from={B.ruleStart} durationInFrames={B.end - B.ruleStart}>
        <RuleRecap />
      </Sequence>
    </AbsoluteFill>
  );
};
