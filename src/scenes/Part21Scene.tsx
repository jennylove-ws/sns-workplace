import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {StepValue} from '../components/NumberDisplay';
import {SlideImage} from '../components/SlideImage';

// 파트21 오디오 구간(900.24s~956.84s) = 1698프레임
export const PART21_DURATION = 1698;

const B = {
  safeStart: 0,
  moreStart: 248, // 8.27s
  momentStart: 525, // +9.23s
  waitStart: 717, // +6.4s
  neverStart: 1007, // +9.67s
  notGamblersStart: 1105, // +3.27s
  fiftyTrillionStart: 1472, // +12.23s
  end: PART21_DURATION, // +7.53s
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

const SafeCoinGrows: React.FC = () => {
  const frame = useCurrentFrame();
  const balance = 1_000_000 + Math.floor(frame * 137);
  return (
    <AbsoluteFill>
      <Caption text="위험한 코인이 아니라, 안전한 코인이라고 했다" color={COLORS.accentGreen} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
            내 UST 잔액
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 90, fontWeight: 800, color: COLORS.accentGreen}}>
            {balance.toLocaleString()}
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.accentGreen}}>
            매일 아주 조금씩 늘어난다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const DEPOSITS = [
  {atFrame: 20, label: '처음엔 조금', amount: '10만 원'},
  {atFrame: 90, label: '잘 되니까 더 많이', amount: '500만 원'},
  {atFrame: 160, label: '전세금도', amount: '2억 원'},
  {atFrame: 230, label: '퇴직금도', amount: '8천만 원'},
];

const GraduallyMore: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Caption text="그래서, 넣습니다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {DEPOSITS.map((d) => {
            const local = frame - d.atFrame;
            const reveal = spring({frame: local, fps, config: {damping: 14, stiffness: 160}, durationInFrames: 18});
            return (
              <div
                key={d.label}
                style={{
                  opacity: reveal,
                  transform: `translateX(${(1 - reveal) * -30}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 30,
                  width: 560,
                }}
              >
                <span style={{fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim, width: 220}}>
                  {d.label}
                </span>
                <span style={{fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 800, color: COLORS.gold}}>
                  {d.amount}
                </span>
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const The098Moment: React.FC = () => {
  const frame = useCurrentFrame();
  const questionOpacity = interpolate(frame, [140, 165], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="5월의 어느 밤" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <StepValue
            steps={[
              {value: '$1.00', atFrame: 0},
              {value: '$0.98', atFrame: 60},
            ]}
            fontSize={140}
          />
          <div
            style={{
              opacity: questionOpacity,
              fontFamily: FONT_FAMILY,
              fontSize: 40,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            자, 여기서 어떻게 하시겠어요
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const THOUGHTS = [
  {atFrame: 0, text: '지금 팔면 2% 손해'},
  {atFrame: 45, text: '아깝죠'},
  {atFrame: 90, text: '여태 잘 돌아왔잖아요'},
  {atFrame: 150, text: '곧 1달러로 돌아올 거니까'},
];

const WaitDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Caption text="사람들은 기다렸다" />
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
                  fontSize: 32,
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

const NeverReturned: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div
        style={{
          opacity,
          fontFamily: FONT_FAMILY,
          fontSize: 52,
          fontWeight: 800,
          color: COLORS.accent,
          textAlign: 'center',
          maxWidth: 1300,
        }}
      >
        기다린 사람들의 돈은
        <br />
        돌아오지 않았다
      </div>
    </Centered>
  );
};

const NotGamblers: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [80, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op3 = interpolate(frame, [180, 210], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        <div style={{opacity: op1, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.inkDim}}>
          이게 이 사건에서 제일 잔인한 부분입니다
        </div>
        <div
          style={{
            opacity: op2,
            fontFamily: FONT_FAMILY,
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.inkDim,
            textDecoration: 'line-through',
            textDecorationColor: COLORS.accent,
          }}
        >
          겁 없이 도박한 사람들이 당한 게 아니다
        </div>
        <div
          style={{
            opacity: op3,
            fontFamily: FONT_FAMILY,
            fontSize: 42,
            fontWeight: 800,
            color: COLORS.ink,
            textAlign: 'center',
          }}
        >
          안전해 보이는 쪽을 고른 사람들이 당했다
        </div>
      </div>
    </Centered>
  );
};

const FiftyTrillion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const numReveal = spring({frame, fps, config: {damping: 14, stiffness: 140}, durationInFrames: 24});
  const l2 = interpolate(frame, [100, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dim = interpolate(frame, [0, 30], [0, 0.66], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_dtzi03dtzi03dtzi.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <AbsoluteFill style={{background: `rgba(10,10,12,${dim})`}} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <div
            style={{
              opacity: numReveal,
              transform: `scale(${0.8 + numReveal * 0.2})`,
              fontFamily: FONT_FAMILY,
              fontSize: 130,
              fontWeight: 800,
              color: COLORS.accent,
              textShadow: '0 2px 24px rgba(0,0,0,0.95)',
            }}
          >
            50조 원
          </div>
          <div
            style={{
              opacity: l2,
              fontFamily: FONT_FAMILY,
              fontSize: 34,
              fontWeight: 700,
              color: COLORS.ink,
              textAlign: 'center',
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            누군가의 전세금, 누군가의 몇 년치 월급
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part21Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.safeStart} durationInFrames={B.moreStart - B.safeStart}>
        <SafeCoinGrows />
      </Sequence>

      <Sequence from={B.moreStart} durationInFrames={B.momentStart - B.moreStart}>
        <GraduallyMore />
      </Sequence>

      <Sequence from={B.momentStart} durationInFrames={B.waitStart - B.momentStart}>
        <The098Moment />
      </Sequence>

      <Sequence from={B.waitStart} durationInFrames={B.neverStart - B.waitStart}>
        <WaitDecision />
      </Sequence>

      <Sequence from={B.neverStart} durationInFrames={B.notGamblersStart - B.neverStart}>
        <NeverReturned />
      </Sequence>

      <Sequence from={B.notGamblersStart} durationInFrames={B.fiftyTrillionStart - B.notGamblersStart}>
        <NotGamblers />
      </Sequence>

      <Sequence from={B.fiftyTrillionStart} durationInFrames={B.end - B.fiftyTrillionStart}>
        <FiftyTrillion durationInFrames={B.end - B.fiftyTrillionStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
