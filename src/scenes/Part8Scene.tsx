import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {SlideImage} from '../components/SlideImage';
import {RateCompareBar} from '../components/RateCompareBar';
import {AnimatedWaveform} from '../components/AnimatedWaveform';

// 파트08 오디오 구간(329.77s~371.0s) = 1237프레임
export const PART8_DURATION = 1237;

const B = {
  hookStart: 0,
  anchorStart: 240, // 8.0s (질문 텍스트만 오래 정지해 있지 않도록 단축)
  compareStart: 673, // +14.43s (파형 배경이 생긴 만큼 리빌에 시간을 더 줌)
  rateStart: 925, // +8.4s
  end: PART8_DURATION, // +10.4s
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

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 60,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            사람들은 왜 샀을까?
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 600,
              color: COLORS.inkDim,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            가격은 절대 오르지 않는 코인인데
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const AnchorReveal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_bv3lwvbv3lwvbv3l.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <div style={{position: 'absolute', top: '32%', left: 0, right: 0, textAlign: 'center', opacity: textOpacity}}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            fontWeight: 800,
            color: COLORS.gold,
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 12,
            padding: '14px 32px',
          }}
        >
          앵커 프로토콜 = 코인 저축 앱
        </span>
      </div>
    </AbsoluteFill>
  );
};

const BankVsAnchor: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const col: React.CSSProperties = {
    width: 340,
    height: 260,
    borderRadius: 20,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    opacity,
  };
  return (
    <AbsoluteFill>
      <Caption text="누가 이자를 굴리는가" />
      <Centered>
        <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
          <div style={col}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 36, fontWeight: 800, color: COLORS.ink}}>은행</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 600, color: COLORS.inkDim}}>
              직원 + 지점
            </span>
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 800, color: COLORS.inkDim, opacity}}>
            VS
          </div>
          <div style={{...col, borderColor: COLORS.gold}}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 36, fontWeight: 800, color: COLORS.gold}}>앵커</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 600, color: COLORS.inkDim}}>
              코드
            </span>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const RateReveal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <AbsoluteFill>
    <Caption text="연 19.5%, 은행의 일곱 배" color={COLORS.accent} />
    <Centered>
      <RateCompareBar
        durationInFrames={durationInFrames}
        maxValue={19.5}
        bars={[
          {label: '은행 예금', value: 2.5, display: '2~3%', color: COLORS.inkDim},
          {label: '앵커', value: 19.5, display: '19.5%', color: COLORS.accent},
        ]}
        footnote="약 7배"
      />
    </Centered>
  </AbsoluteFill>
);

export const Part8Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.hookStart} durationInFrames={B.anchorStart - B.hookStart}>
        <Hook />
      </Sequence>

      <Sequence from={B.anchorStart} durationInFrames={B.compareStart - B.anchorStart}>
        <AnchorReveal durationInFrames={B.compareStart - B.anchorStart} />
      </Sequence>

      <Sequence from={B.compareStart} durationInFrames={B.rateStart - B.compareStart}>
        <BankVsAnchor />
      </Sequence>

      <Sequence from={B.rateStart} durationInFrames={B.end - B.rateStart}>
        <RateReveal durationInFrames={B.end - B.rateStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
