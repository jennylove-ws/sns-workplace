import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {SlideImage} from '../components/SlideImage';

// 파트13 오디오 구간(543.04s~586.36s) = 1300프레임
export const PART13_DURATION = 1300;

const B = {
  flowStart: 0,
  surfaceStart: 197, // 6.57s
  moneyFirstStart: 480, // +9.43s
  notMockingStart: 541, // +2.03s
  complexityStart: 748, // +6.9s
  transparentStart: 1078, // +11s
  end: PART13_DURATION, // +7.4s
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

const InflowOutflow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const inH = 320 * (1 - t * 0.65);
  const outH = 120 + 260 * t;
  const barCol: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  };
  return (
    <AbsoluteFill>
      <Caption text="앵커 내부에서 이미 바뀌고 있던 흐름" />
      <Centered>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 110, height: 380}}>
          <div style={barCol}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
              새로 맡기는 돈
            </span>
            <div style={{width: 130, height: Math.max(6, inH), background: COLORS.gold, borderRadius: '8px 8px 0 0'}} />
            <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 800, color: COLORS.gold}}>느려짐</span>
          </div>
          <div style={barCol}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
              빼가는 돈
            </span>
            <div style={{width: 130, height: Math.max(6, outH), background: COLORS.accent, borderRadius: '8px 8px 0 0'}} />
            <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 800, color: COLORS.accent}}>빨라짐</span>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const SurfaceSame: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform
        waves={[
          {amplitude: 46, wavelength: 260, speed: 2.4, yOffset: 0.62, color: COLORS.accent, opacity: 0.3, strokeWidth: 3},
          {amplitude: 30, wavelength: 340, speed: -2.0, yOffset: 0.72, color: COLORS.accent, opacity: 0.2, strokeWidth: 2},
        ]}
      />
      <Caption text="겉으로는 아무것도 달라지지 않았다" />
      <Centered>
        <div
          style={{
            opacity,
            fontFamily: FONT_FAMILY,
            fontSize: 130,
            fontWeight: 800,
            color: COLORS.ink,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}
        >
          19.5%
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const MoneyFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div
          style={{
            opacity,
            fontFamily: FONT_FAMILY,
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.ink,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}
        >
          돈은 뉴스보다 먼저 움직인다
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const NotMocking: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div
        style={{
          opacity,
          fontFamily: FONT_FAMILY,
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.ink,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 1200,
        }}
      >
        이 영상은 당시 투자한 사람들을
        <br />
        비웃으려고 만든 게 아닙니다
      </div>
    </Centered>
  );
};

const Complexity: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [8, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_2v26ro2v26ro2v26.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.accent,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 12,
            padding: '10px 28px',
          }}
        >
          백서엔 수식, 커뮤니티 글은 죄다 영어
        </span>
      </div>
    </AbsoluteFill>
  );
};

const Transparent: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="모든 거래가 공개된다 = 안전할 것 같다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, opacity}}>
          <span style={{fontSize: 100}}>📖</span>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 44, fontWeight: 800, color: COLORS.accentGreen}}>
            투명한 장부
          </span>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part13Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.flowStart} durationInFrames={B.surfaceStart - B.flowStart}>
        <InflowOutflow />
      </Sequence>

      <Sequence from={B.surfaceStart} durationInFrames={B.moneyFirstStart - B.surfaceStart}>
        <SurfaceSame />
      </Sequence>

      <Sequence from={B.moneyFirstStart} durationInFrames={B.notMockingStart - B.moneyFirstStart}>
        <MoneyFirst />
      </Sequence>

      <Sequence from={B.notMockingStart} durationInFrames={B.complexityStart - B.notMockingStart}>
        <NotMocking />
      </Sequence>

      <Sequence from={B.complexityStart} durationInFrames={B.transparentStart - B.complexityStart}>
        <Complexity durationInFrames={B.transparentStart - B.complexityStart} />
      </Sequence>

      <Sequence from={B.transparentStart} durationInFrames={B.end - B.transparentStart}>
        <Transparent />
      </Sequence>
    </AbsoluteFill>
  );
};
