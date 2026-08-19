import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AudioBars} from '../components/AudioBars';

// 파트25 오디오 구간(1092.88s~1145.12s) = 1567프레임 (에피소드 마지막 파트)
export const PART25_DURATION = 1567;

const B = {
  thesisStart: 0,
  askStart: 271, // 9.03s
  ctaStart: 660, // +12.97s
  teaserStart: 884, // +7.47s
  outroStart: 1317, // +14.43s
  end: PART25_DURATION, // +8.33s
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

// 이 사건 전체를 관통하는 핵심 문장. 영상에서 가장 무게감 있는 순간이므로
// 배경 장식 없이 타이포그래피 자체(스케일·색·은은한 글로우)로만 승부한다.
const CoreThesis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const introOp = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const notPriceOp = interpolate(frame, [93, 118], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const beliefReveal = spring({frame: frame - 202, fps, config: {damping: 13, stiffness: 120}, durationInFrames: 30});
  const glowPulse = 0.35 + Math.sin(frame / 14) * 0.15;
  const thenOp = interpolate(frame, [226, 251], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{opacity: introOp, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
          이 사건이 남긴 한 문장
        </div>
        <div
          style={{
            opacity: notPriceOp,
            fontFamily: FONT_FAMILY,
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.inkDim,
          }}
        >
          가장 먼저 무너지는 건, 가격이 아니다
        </div>
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div
            style={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(216,180,90,${glowPulse}) 0%, rgba(216,180,90,0) 70%)`,
            }}
          />
          <div
            style={{
              opacity: beliefReveal,
              transform: `scale(${0.85 + beliefReveal * 0.15})`,
              fontFamily: FONT_FAMILY,
              fontSize: 120,
              fontWeight: 800,
              color: COLORS.gold,
              position: 'relative',
            }}
          >
            믿음입니다
          </div>
        </div>
        <div style={{opacity: thenOp, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
          가격은, 그다음입니다
        </div>
      </div>
    </Centered>
  );
};

// 순수 내레이션 재진술 비트 — 다른 시각 요소가 없으므로 보조 동적 요소를 곁들인다.
// (앞선 파트들에서 AnimatedWaveform을 반복 사용했으니 여기서는 AudioBars로 변화를 준다)
const AskViewer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const q1Op = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const q2Op = interpolate(frame, [73, 98], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const priceReveal = spring({frame: frame - 183, fps, config: {damping: 14, stiffness: 150}, durationInFrames: 20});
  const detail1Op = interpolate(frame, [211, 236], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const detail2Op = interpolate(frame, [260, 285], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pollOp = interpolate(frame, [333, 358], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const choiceBox: React.CSSProperties = {
    padding: '14px 30px',
    borderRadius: 12,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: 800,
  };
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AudioBars width={180} height={50} opacity={0.4} />
      </div>
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <div style={{opacity: q1Op, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
            마지막으로 하나 여쭤보고 싶습니다
          </div>
          <div
            style={{
              opacity: q2Op,
              fontFamily: FONT_FAMILY,
              fontSize: 38,
              fontWeight: 800,
              color: COLORS.ink,
              textAlign: 'center',
              maxWidth: 1100,
            }}
          >
            그 밤, 여러분이라면 어떻게 하셨을 것 같으세요?
          </div>
          <div
            style={{
              opacity: priceReveal,
              transform: `scale(${0.85 + priceReveal * 0.15})`,
              fontFamily: FONT_FAMILY,
              fontSize: 70,
              fontWeight: 800,
              color: COLORS.accent,
              marginTop: 10,
            }}
          >
            $0.98
          </div>
          <div style={{opacity: detail1Op, fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
            지금 팔면 2% 손해
          </div>
          <div style={{opacity: detail2Op, fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
            기다리면 돌아올지도 모르는 상황
          </div>
          <div style={{opacity: pollOp, display: 'flex', gap: 30, marginTop: 14}}>
            <div style={{...choiceBox, borderColor: COLORS.accent, color: COLORS.accent}}>매도</div>
            <div style={{...choiceBox, borderColor: COLORS.accentGreen, color: COLORS.accentGreen}}>대기</div>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

// 댓글 유도 — 말풍선 아이콘이 스스로 시각 요소가 되므로 파형/막대는 넣지 않는다.
const CommentCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubbleReveal = spring({frame, fps, config: {damping: 12, stiffness: 140}, durationInFrames: 20});
  const bob = Math.sin(frame / 10) * 6;
  const textOp = interpolate(frame, [30, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subOp = interpolate(frame, [114, 139], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <div
          style={{
            opacity: bubbleReveal,
            transform: `scale(${0.7 + bubbleReveal * 0.3}) translateY(${bob}px)`,
            fontSize: 90,
          }}
        >
          💬
        </div>
        <div style={{opacity: textOp, fontFamily: FONT_FAMILY, fontSize: 38, fontWeight: 800, color: COLORS.ink}}>
          댓글로 알려주세요
        </div>
        <div style={{opacity: subOp, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.gold}}>
          이 채널이 계속 다루게 될 질문입니다
        </div>
      </div>
    </Centered>
  );
};

// 다음 화 예고 — 은행 아이콘이 문자메시지에 흔들리는 자체 애니메이션이 시각적
// 초점이므로 별도 배경 장식은 넣지 않는다.
const NextEpisodeTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const introOp = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const notCoinOp = interpolate(frame, [143, 168], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bankOp = interpolate(frame, [195, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const msgLocal = frame - 302;
  const msgCount = Math.min(5, Math.max(0, Math.floor(msgLocal / 14)));
  const shake = msgLocal > 0 ? Math.sin(frame / 3) * Math.min(6, msgCount * 1.4) : 0;
  return (
    <AbsoluteFill>
      <Caption text="다음 화 예고" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <div style={{opacity: introOp, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.ink, textAlign: 'center'}}>
            은행 하나가 단 이틀 만에 사라진 사건
          </div>
          <div style={{opacity: notCoinOp, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.accent}}>
            이번엔 코인이 아닙니다
          </div>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140}}>
            <div
              style={{
                opacity: bankOp,
                fontSize: 90,
                transform: `translateX(${shake}px)`,
              }}
            >
              🏦
            </div>
            {Array.from({length: msgCount}).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: 26,
                  left: `${50 + (i - 2) * 16}%`,
                  top: -10 - (i % 2) * 20,
                }}
              >
                💬
              </div>
            ))}
          </div>
          <div style={{opacity: bankOp, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 800, color: COLORS.ink, textAlign: 'center'}}>
            미국 16번째로 큰, 진짜 은행
          </div>
          <div style={{opacity: msgCount > 0 ? 1 : 0, fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.gold}}>
            무너뜨린 건 예금자들의 문자메시지였다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

// 채널 아웃트로 — 구독 벨 아이콘이 자체 펄스 애니메이션을 가지므로 배경 장식은 생략.
const OutroSubscribe: React.FC = () => {
  const frame = useCurrentFrame();
  const introOp = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bellPulse = 1 + Math.sin(frame / 8) * 0.08;
  const subOp = interpolate(frame, [79, 104], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const byeOp = interpolate(frame, [185, 215], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{opacity: introOp, fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.inkDim}}>
          돈이 움직인 사건을 계속 추적합니다
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: subOp}}>
          <span style={{fontSize: 54, transform: `scale(${bellPulse})`, display: 'inline-block'}}>🔔</span>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 800, color: COLORS.gold}}>구독</span>
        </div>
        <div style={{opacity: subOp, fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim}}>
          다음 궤적을 놓치지 않으실 겁니다
        </div>
        <div
          style={{
            opacity: byeOp,
            marginTop: 20,
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: 2,
          }}
        >
          다음 사건에서 뵙겠습니다
        </div>
      </div>
    </Centered>
  );
};

export const Part25Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.thesisStart} durationInFrames={B.askStart - B.thesisStart}>
        <CoreThesis />
      </Sequence>

      <Sequence from={B.askStart} durationInFrames={B.ctaStart - B.askStart}>
        <AskViewer />
      </Sequence>

      <Sequence from={B.ctaStart} durationInFrames={B.teaserStart - B.ctaStart}>
        <CommentCTA />
      </Sequence>

      <Sequence from={B.teaserStart} durationInFrames={B.outroStart - B.teaserStart}>
        <NextEpisodeTeaser />
      </Sequence>

      <Sequence from={B.outroStart} durationInFrames={B.end - B.outroStart}>
        <OutroSubscribe />
      </Sequence>
    </AbsoluteFill>
  );
};
