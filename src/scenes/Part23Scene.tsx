import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';

// 파트23 오디오 구간(1006.76s~1046.16s) = 1182프레임
export const PART23_DURATION = 1182;

const B = {
  lesson2Start: 0,
  lesson3Start: 572, // 19.07s
  notOldStoryStart: 1002, // +14.33s
  end: PART23_DURATION, // +6s
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

const LessonBadge: React.FC<{num: string; opacity: number}> = ({num, opacity}) => (
  <div
    style={{
      opacity,
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
      flexShrink: 0,
    }}
  >
    {num}
  </div>
);

const QUESTIONS = [
  {atFrame: 275, label: '누가 벌어서'},
  {atFrame: 315, label: '누구 돈으로'},
  {atFrame: 355, label: '언제까지 주는가'},
];

const Lesson2: React.FC = () => {
  const frame = useCurrentFrame();
  const badgeOp = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleOp = interpolate(frame, [10, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const numReveal = interpolate(frame, [122, 147], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const realQOp = interpolate(frame, [214, 239], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const conclusionOp = interpolate(frame, [435, 460], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="수익률보다, 그 수익이 어디서 나오는지가 먼저다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <LessonBadge num="2" opacity={badgeOp} />
            <div style={{opacity: titleOp, fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 800, color: COLORS.ink}}>
              수익이 어디서 나오는지가 먼저다
            </div>
          </div>
          <div
            style={{
              opacity: numReveal,
              fontFamily: FONT_FAMILY,
              fontSize: 90,
              fontWeight: 800,
              color: COLORS.inkDim,
            }}
          >
            연 19.5%
          </div>
          <div style={{opacity: realQOp, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.gold}}>
            그냥 숫자다 — 진짜 봐야 할 건 그 뒤
          </div>
          <div style={{display: 'flex', gap: 20}}>
            {QUESTIONS.map((q) => {
              const local = frame - q.atFrame;
              const op = interpolate(local, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div
                  key={q.label}
                  style={{
                    opacity: op,
                    padding: '12px 20px',
                    borderRadius: 10,
                    background: COLORS.panel,
                    border: `1px solid ${COLORS.line}`,
                    fontFamily: FONT_FAMILY,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.ink,
                  }}
                >
                  {q.label}
                </div>
              );
            })}
          </div>
          <div
            style={{
              opacity: conclusionOp,
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.accent,
              textAlign: 'center',
              maxWidth: 900,
            }}
          >
            답 없으면, 누군가의 주머니에서 나오는 것
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const Lesson3: React.FC = () => {
  const frame = useCurrentFrame();
  const badgeOp = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleOp = interpolate(frame, [10, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bookOp = interpolate(frame, [77, 102], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lateOp = interpolate(frame, [188, 213], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line1Op = interpolate(frame, [288, 313], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line2Op = interpolate(frame, [369, 394], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Caption text="투명하다고, 쉬운 건 아니다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <LessonBadge num="3" opacity={badgeOp} />
            <div style={{opacity: titleOp, fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 800, color: COLORS.ink}}>
              투명하다고, 쉬운 건 아니다
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: bookOp}}>
            <span style={{fontSize: 46}}>📖</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.accentGreen}}>
              테라의 장부: 처음부터 끝까지 100% 공개
            </span>
          </div>
          <div style={{opacity: lateOp, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
            그런데도 대부분은 늦게 알았다
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 6}}>
            <div style={{opacity: line1Op, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, color: COLORS.gold}}>
              복잡함은 어둠 속에만 숨지 않는다
            </div>
            <div style={{opacity: line2Op, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, color: COLORS.gold}}>
              밝은 곳에도 숨는다
            </div>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const NotOldStory: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op2 = interpolate(frame, [80, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
            여기서 끝내면 안 될 것 같습니다
          </div>
          <div
            style={{
              opacity: op2,
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
              textAlign: 'center',
            }}
          >
            이건 다 끝난 옛날얘기가 아니거든요
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part23Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.lesson2Start} durationInFrames={B.lesson3Start - B.lesson2Start}>
        <Lesson2 />
      </Sequence>

      <Sequence from={B.lesson3Start} durationInFrames={B.notOldStoryStart - B.lesson3Start}>
        <Lesson3 />
      </Sequence>

      <Sequence from={B.notOldStoryStart} durationInFrames={B.end - B.notOldStoryStart}>
        <NotOldStory />
      </Sequence>
    </AbsoluteFill>
  );
};
