import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {StepValue} from '../components/NumberDisplay';
import {SlideImage} from '../components/SlideImage';

// 파트19 오디오 구간(814.08s~851.64s) = 1127프레임
export const PART19_DURATION = 1127;

const B = {
  repriceStart: 0,
  anchorGoneStart: 357, // 11.9s
  rescueStart: 564, // +6.9s
  questionStart: 684, // +4s
  noExitStart: 890, // +6.87s
  end: PART19_DURATION, // +7.9s
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

const RepriceReality: React.FC = () => {
  const frame = useCurrentFrame();
  const peel = interpolate(frame, [30, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="지금 팔리는 값이, 진짜 값이다" color={COLORS.accent} />
      <Centered>
        <div style={{position: 'relative', width: 420, height: 220}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontSize: 90,
              fontWeight: 800,
              color: COLORS.inkDim,
            }}
          >
            <StepValue
              steps={[
                {value: '$0.68', atFrame: 0},
                {value: '$0.30', atFrame: 110},
              ]}
              fontSize={90}
              color={COLORS.accent}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: COLORS.panel,
              border: `3px solid ${COLORS.line}`,
              borderRadius: 16,
              opacity: 1 - peel,
              transform: `rotate(${peel * -25}deg) translateY(${peel * -60}px)`,
              transformOrigin: 'left center',
            }}
          >
            <span style={{fontFamily: FONT_FAMILY, fontSize: 64, fontWeight: 800, color: COLORS.ink}}>$1.00</span>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const AnchorLineGone: React.FC = () => {
  const frame = useCurrentFrame();
  const lineOpacity = interpolate(frame, [30, 90], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const textOpacity = interpolate(frame, [90, 115], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="1달러라는 기준선 자체가 사라졌다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <div style={{position: 'relative', width: 700, height: 4}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderTop: `4px dashed ${COLORS.gold}`,
                opacity: lineOpacity,
              }}
            />
          </div>
          <div
            style={{
              opacity: textOpacity,
              fontFamily: FONT_FAMILY,
              fontSize: 44,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            더 이상 안정 코인이 아니다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const LiquidityRescue: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 50, [0, 25, 50], [0.9, 1.08, 0.9]);
  return (
    <AbsoluteFill>
      <Caption text="유동성을 끌어와 신뢰를 되돌리려 했다" />
      <Centered>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <span style={{fontSize: 60}}>💉</span>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              border: `4px solid ${COLORS.accentGreen}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${pulse})`,
              fontFamily: FONT_FAMILY,
              fontSize: 40,
              fontWeight: 800,
              color: COLORS.accentGreen,
            }}
          >
            UST
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const WhoLeavesLast: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [70, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <div
            style={{
              opacity: op1,
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.inkDim,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            사람들 머릿속엔 같은 질문 하나뿐이었다
          </div>
          <div
            style={{
              opacity: op2,
              fontFamily: FONT_FAMILY,
              fontSize: 60,
              fontWeight: 800,
              color: COLORS.accent,
              textShadow: '0 2px 24px rgba(0,0,0,0.95)',
              textAlign: 'center',
            }}
          >
            누가 마지막에 나가게 되는가
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const NoExit: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [10, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/donui-gwejeok-ep1-scene14-funnel-exit.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <div style={{position: 'absolute', top: '30%', left: 0, right: 0, textAlign: 'center', opacity: textOpacity}}>
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
          모두가 동시에 나갈 수 있는 출구는 없다
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Part19Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.repriceStart} durationInFrames={B.anchorGoneStart - B.repriceStart}>
        <RepriceReality />
      </Sequence>

      <Sequence from={B.anchorGoneStart} durationInFrames={B.rescueStart - B.anchorGoneStart}>
        <AnchorLineGone />
      </Sequence>

      <Sequence from={B.rescueStart} durationInFrames={B.questionStart - B.rescueStart}>
        <LiquidityRescue />
      </Sequence>

      <Sequence from={B.questionStart} durationInFrames={B.noExitStart - B.questionStart}>
        <WhoLeavesLast />
      </Sequence>

      <Sequence from={B.noExitStart} durationInFrames={B.end - B.noExitStart}>
        <NoExit durationInFrames={B.end - B.noExitStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
