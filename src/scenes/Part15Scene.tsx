import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {StepValue} from '../components/NumberDisplay';
import {SlideImage} from '../components/SlideImage';

// 파트15 오디오 구간(633.2s~674.4s) = 1236프레임
export const PART15_DURATION = 1236;

const B = {
  ledgerStart: 0,
  panicStart: 268, // 8.93s
  signalStart: 420, // +5.07s
  speedStart: 616, // +6.53s
  pegStart: 850, // +7.8s
  waitStart: 1017, // +5.57s
  end: PART15_DURATION, // +7.3s
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

const PublicLedger: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rowReveal = (i: number) =>
    spring({frame: frame - i * 20, fps, config: {damping: 14, stiffness: 160}, durationInFrames: 16});
  const rows = ['지갑 A ... +820만 UST', '지갑 B ... -140만 UST', '지갑 C(큰손) ... -9,200만 UST', '지갑 D ... -60만 UST'];
  return (
    <AbsoluteFill>
      <Caption text="블록체인은 모든 거래가 공개된다" />
      <Centered>
        <div
          style={{
            width: 780,
            borderRadius: 16,
            background: COLORS.panel,
            border: `2px solid ${COLORS.line}`,
            padding: '30px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {rows.map((row, i) => {
            const r = rowReveal(i);
            const highlight = i === 2;
            return (
              <div
                key={row}
                style={{
                  opacity: r,
                  transform: `translateX(${(1 - r) * -30}px)`,
                  fontFamily: FONT_FAMILY,
                  fontSize: 28,
                  fontWeight: highlight ? 800 : 600,
                  color: highlight ? COLORS.accent : COLORS.inkDim,
                  padding: highlight ? '8px 14px' : 0,
                  background: highlight ? 'rgba(224,72,62,0.12)' : 'transparent',
                  borderRadius: 8,
                }}
              >
                {row}
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const THOUGHTS = [
  {atFrame: 0, text: '어?'},
  {atFrame: 30, text: '큰손이 나가네...'},
  {atFrame: 75, text: '뭘 알고 나가는 거 아냐?'},
  {atFrame: 120, text: '나도 일단 빼야 하나?'},
];

const PanicThoughts: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_9kwtfb9kwtfb9kwt.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.08}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,12,0.5)'}} />
      <Caption text="한 사람의 출금이, 다른 사람에겐 신호가 된다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'flex-start'}}>
          {THOUGHTS.map((t) => {
            const local = frame - t.atFrame;
            const reveal = spring({frame: local, fps, config: {damping: 13, stiffness: 170}, durationInFrames: 16});
            return (
              <div
                key={t.text}
                style={{
                  opacity: reveal,
                  transform: `scale(${0.7 + reveal * 0.3})`,
                  background: COLORS.panel,
                  border: `2px solid ${COLORS.line}`,
                  borderRadius: '20px 20px 20px 4px',
                  padding: '16px 28px',
                  fontFamily: FONT_FAMILY,
                  fontSize: 34,
                  fontWeight: 700,
                  color: COLORS.ink,
                }}
              >
                {t.text}
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const NODES = [
  {x: 0.5, y: 0.5, delay: 0},
  {x: 0.3, y: 0.3, delay: 15},
  {x: 0.68, y: 0.32, delay: 20},
  {x: 0.22, y: 0.62, delay: 35},
  {x: 0.75, y: 0.65, delay: 40},
  {x: 0.5, y: 0.18, delay: 55},
  {x: 0.15, y: 0.42, delay: 65},
  {x: 0.82, y: 0.45, delay: 70},
  {x: 0.4, y: 0.78, delay: 85},
  {x: 0.62, y: 0.8, delay: 95},
];

const SignalSpreads: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = 700;
  const h = 420;
  return (
    <AbsoluteFill>
      <Caption text="신호는 아주 빠르게 불안으로 번진다" color={COLORS.accent} />
      <Centered>
        <svg width={w} height={h}>
          {NODES.map((n, i) => {
            const reveal = spring({
              frame: frame - n.delay,
              fps,
              config: {damping: 12, stiffness: 200},
              durationInFrames: 14,
            });
            return (
              <circle
                key={i}
                cx={n.x * w}
                cy={n.y * h}
                r={i === 0 ? 16 : 10}
                fill={COLORS.accent}
                opacity={reveal}
              />
            );
          })}
        </svg>
      </Centered>
    </AbsoluteFill>
  );
};

const NotCauseButSpeed: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity2 = interpolate(frame, [110, 135], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const needleT = interpolate(frame, [110, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        <div
          style={{
            opacity: opacity1,
            fontFamily: FONT_FAMILY,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.inkDim,
            textAlign: 'center',
          }}
        >
          이 인출만으로 테라가 무너졌다곤 할 수 없다
        </div>
        <div
          style={{
            opacity: opacity2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{position: 'relative', width: 260, height: 12, background: COLORS.line, borderRadius: 6}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${20 + needleT * 80}%`,
                background: COLORS.accent,
                borderRadius: 6,
              }}
            />
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 42, fontWeight: 800, color: COLORS.accent}}>
            다만 여기서부터 속도가 붙는다
          </div>
        </div>
      </div>
    </Centered>
  );
};

const BreaksPeg: React.FC = () => (
  <AbsoluteFill>
    <Caption text="UST가 1달러 밑으로" color={COLORS.accent} />
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <StepValue
          steps={[
            {value: '$1.00', atFrame: 0},
            {value: '$0.99', atFrame: 60},
          ]}
          fontSize={160}
        />
        <div style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
          사실 이것 자체는 흔한 일일 수도 있었다
        </div>
      </div>
    </Centered>
  </AbsoluteFill>
);

const DidntWait: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity2 = interpolate(frame, [90, 115], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <div
            style={{
              opacity: opacity1,
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.inkDim,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            0.99, 0.995 같은 이탈은 늘 있었다
          </div>
          <div
            style={{
              opacity: opacity2,
              fontFamily: FONT_FAMILY,
              fontSize: 54,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            근데 이번엔, 기다려주지 않았다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part15Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.ledgerStart} durationInFrames={B.panicStart - B.ledgerStart}>
        <PublicLedger />
      </Sequence>

      <Sequence from={B.panicStart} durationInFrames={B.signalStart - B.panicStart}>
        <PanicThoughts durationInFrames={B.signalStart - B.panicStart} />
      </Sequence>

      <Sequence from={B.signalStart} durationInFrames={B.speedStart - B.signalStart}>
        <SignalSpreads />
      </Sequence>

      <Sequence from={B.speedStart} durationInFrames={B.pegStart - B.speedStart}>
        <NotCauseButSpeed />
      </Sequence>

      <Sequence from={B.pegStart} durationInFrames={B.waitStart - B.pegStart}>
        <BreaksPeg />
      </Sequence>

      <Sequence from={B.waitStart} durationInFrames={B.end - B.waitStart}>
        <DidntWait />
      </Sequence>
    </AbsoluteFill>
  );
};
