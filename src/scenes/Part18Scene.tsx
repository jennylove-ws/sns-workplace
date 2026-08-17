import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {VendingMachine} from '../components/VendingMachine';

// 파트18 오디오 구간(774.84s~814.08s) = 1177프레임
export const PART18_DURATION = 1177;

const B = {
  dilutionStart: 0,
  engineStart: 370, // 12.33s
  twoDaysStart: 504, // +4.47s
  beforeStart: 604, // +3.33s
  afterStart: 874, // +9s
  end: PART18_DURATION, // +10.1s
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

const StockDilution: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [10, 340], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const myShare = Math.max(2, 100 * (1 - t)); // 내 지분 100% -> 거의 0
  const issued = Math.round(t * 8_400_000);
  const pieStyle: React.CSSProperties = {
    width: 260,
    height: 260,
    borderRadius: '50%',
    background: `conic-gradient(${COLORS.gold} 0deg ${myShare * 3.6}deg, ${COLORS.panel} ${myShare * 3.6}deg 360deg)`,
    border: `3px solid ${COLORS.line}`,
  };
  return (
    <AbsoluteFill>
      <Caption text="주식으로 바꿔 보면 이런 겁니다" />
      <Centered>
        <div style={{display: 'flex', alignItems: 'center', gap: 80}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <div style={pieStyle} />
            <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.gold}}>
              내 지분 {myShare.toFixed(0)}%
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
              빚 갚으려 신주 발행
            </div>
            <div style={{fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: COLORS.accent}}>
              +{issued.toLocaleString()}주
            </div>
            <div style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.accent}}>
              원래 주주 몫 → 0에 수렴
            </div>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const EngineIrony: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div
          style={{
            opacity,
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            fontWeight: 800,
            color: COLORS.accent,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 1300,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}
        >
          가격을 지키라고 만든 장치가
          <br />
          가격을 무너뜨리는 엔진이 됐다
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const TwoDays: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subOpacity = interpolate(frame, [40, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 160, fontWeight: 800, color: COLORS.ink, letterSpacing: 2}}>
          이틀
        </div>
        <div style={{opacity: subOpacity, fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 700, color: COLORS.inkDim}}>
          사람들 생각이 바뀌는 데 걸린 시간
        </div>
      </div>
    </Centered>
  );
};

const BeforeTrust: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [80, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="0.98달러여도, 다들 느긋했다" color={COLORS.accentGreen} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <VendingMachine phase="idle" leftLabel="UST 0.98" rightLabel="곧 $1.00" />
          <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.accentGreen}}>
            자판기가 있으니 곧 돌아오겠지
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const AfterDistrust: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const xOpacity = interpolate(frame, [130, 155], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const footerOpacity = interpolate(frame, [200, 225], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="그 믿음이 사라졌다 — 루나가 무너지는 걸 두 눈으로 봤으니까" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{opacity: eyeOpacity, fontSize: 70}}>👁️</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <VendingMachine phase="idle" leftLabel="정상 작동" rightLabel="LUNA" />
            <div style={{position: 'relative', width: 0, height: 0}}>
              <span
                style={{
                  position: 'absolute',
                  left: -80,
                  top: -260,
                  fontSize: 90,
                  color: COLORS.accent,
                  opacity: xOpacity,
                }}
              >
                ✕
              </span>
            </div>
          </div>
          <div style={{opacity: footerOpacity, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, color: COLORS.accent}}>
            자판기는 멀쩡한데, 아무도 결과를 믿지 않는다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part18Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.dilutionStart} durationInFrames={B.engineStart - B.dilutionStart}>
        <StockDilution />
      </Sequence>

      <Sequence from={B.engineStart} durationInFrames={B.twoDaysStart - B.engineStart}>
        <EngineIrony />
      </Sequence>

      <Sequence from={B.twoDaysStart} durationInFrames={B.beforeStart - B.twoDaysStart}>
        <TwoDays />
      </Sequence>

      <Sequence from={B.beforeStart} durationInFrames={B.afterStart - B.beforeStart}>
        <BeforeTrust />
      </Sequence>

      <Sequence from={B.afterStart} durationInFrames={B.end - B.afterStart}>
        <AfterDistrust />
      </Sequence>
    </AbsoluteFill>
  );
};
