import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {SlideImage} from '../components/SlideImage';

// 파트22 오디오 구간(956.84s~1006.76s) = 1498프레임 (재녹음으로 길이 갱신됨)
export const PART22_DURATION = 1498;

const B = {
  courtStart: 0,
  hiddenReasonStart: 564, // 18.8s
  whatWeLearnStart: 953, // +12.97s
  lesson1Start: 1040, // +2.9s
  end: PART22_DURATION, // +15.27s
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

const CourtVerdict: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const l1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l2 = interpolate(frame, [87, 112], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l3 = interpolate(frame, [238, 263], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l4 = interpolate(frame, [362, 387], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/donui-gwejeok-ep1-scene15-court-regulator.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,12,0.5)'}} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
          <div
            style={{
              opacity: l1,
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.ink,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            책임 문제는 법정으로 넘어갔다
          </div>
          <div
            style={{
              opacity: l2,
              fontFamily: FONT_FAMILY,
              fontSize: 30,
              fontWeight: 700,
              color: COLORS.gold,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            "투자자를 속였다" — 배심원단 평결
          </div>
          <div
            style={{
              opacity: l3,
              fontFamily: FONT_FAMILY,
              fontSize: 46,
              fontWeight: 800,
              color: COLORS.accent,
              textShadow: '0 2px 20px rgba(0,0,0,0.95)',
            }}
          >
            45억 달러+ 배상 합의
          </div>
          <div
            style={{
              opacity: l4,
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            권도형: 유죄 인정 · 15년형
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const HiddenReason: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [117, 142], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op3 = interpolate(frame, [288, 313], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="법원이 밝혀준 건, 책임을 지는 사람까지" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{display: 'flex', gap: 60}}>
            <div
              style={{
                opacity: op1,
                width: 240,
                padding: '24px 20px',
                borderRadius: 14,
                background: COLORS.panel,
                border: `2px solid ${COLORS.accentGreen}`,
                textAlign: 'center',
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.accentGreen,
              }}
            >
              누가 책임지는가 ✓
            </div>
            <div
              style={{
                opacity: op2,
                width: 240,
                padding: '24px 20px',
                borderRadius: 14,
                background: COLORS.panel,
                border: `2px solid ${COLORS.accent}`,
                textAlign: 'center',
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                fontWeight: 700,
                color: COLORS.accent,
              }}
            >
              왜 무너졌는가 ?
            </div>
          </div>
          <div
            style={{
              opacity: op3,
              fontFamily: FONT_FAMILY,
              fontSize: 30,
              fontWeight: 700,
              color: COLORS.gold,
              textAlign: 'center',
            }}
          >
            그래서 오늘, 그 이야기를 하고 싶었습니다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const WhatWeLearn: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
          그럼, 우리가 배울 건 뭘까요
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const ANCHOR_OPTIONS = [
  {atFrame: 370, label: '달러'},
  {atFrame: 405, label: '국채'},
  {atFrame: 440, label: '다른 코인 가격'},
];

const Lesson1: React.FC = () => {
  const frame = useCurrentFrame();
  const numOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bodyOpacity = interpolate(frame, [30, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const questionOpacity = interpolate(frame, [237, 262], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="스테이블코인이라고 다 같은 스테이블코인이 아니다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div
              style={{
                opacity: numOpacity,
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `3px solid ${COLORS.gold}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT_FAMILY,
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.gold,
              }}
            >
              1
            </div>
            <div
              style={{
                opacity: bodyOpacity,
                fontFamily: FONT_FAMILY,
                fontSize: 34,
                fontWeight: 800,
                color: COLORS.ink,
              }}
            >
              '안정'이 붙어도, 금고가 있는 건 아니다
            </div>
          </div>
          <div style={{opacity: questionOpacity, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
            뭘로 그 안정을 유지하는지를 봐야 한다
          </div>
          <div style={{display: 'flex', gap: 24}}>
            {ANCHOR_OPTIONS.map((o) => {
              const local = frame - o.atFrame;
              const op = interpolate(local, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const scale = interpolate(local, [0, 15], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div
                  key={o.label}
                  style={{
                    opacity: op,
                    transform: `scale(${scale})`,
                    padding: '14px 24px',
                    borderRadius: 12,
                    background: COLORS.panel,
                    border: `1px solid ${COLORS.line}`,
                    fontFamily: FONT_FAMILY,
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLORS.gold,
                  }}
                >
                  {o.label}?
                </div>
              );
            })}
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part22Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.courtStart} durationInFrames={B.hiddenReasonStart - B.courtStart}>
        <CourtVerdict durationInFrames={B.hiddenReasonStart - B.courtStart} />
      </Sequence>

      <Sequence from={B.hiddenReasonStart} durationInFrames={B.whatWeLearnStart - B.hiddenReasonStart}>
        <HiddenReason />
      </Sequence>

      <Sequence from={B.whatWeLearnStart} durationInFrames={B.lesson1Start - B.whatWeLearnStart}>
        <WhatWeLearn />
      </Sequence>

      <Sequence from={B.lesson1Start} durationInFrames={B.end - B.lesson1Start}>
        <Lesson1 />
      </Sequence>
    </AbsoluteFill>
  );
};
