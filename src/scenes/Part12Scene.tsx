import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {CrashChart} from '../components/CrashChart';

// 파트12 오디오 구간(496.08s~543.04s) = 1409프레임
export const PART12_DURATION = 1409;

const B = {
  rateCutStart: 0,
  questionStart: 253, // 8.43s
  illusionStart: 392, // +4.63s
  peakStart: 719, // +10.9s
  thinsStart: 1053, // +11.13s
  end: PART12_DURATION, // +11.87s
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

const RateCutProposal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = spring({frame: frame - 40, fps, config: {damping: 14, stiffness: 140}, durationInFrames: 30});
  return (
    <AbsoluteFill>
      <Caption text="테라 커뮤니티 안에서 나온 제안" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 150, fontWeight: 800, color: COLORS.inkDim}}>19.5%</span>
          <span
            style={{
              fontSize: 60,
              color: COLORS.accentGreen,
              transform: `scale(${0.85 + drop * 0.15})`,
            }}
          >
            ↓
          </span>
          <span style={{fontFamily: FONT_FAMILY, fontSize: 60, fontWeight: 800, color: COLORS.accentGreen}}>
            감당 가능한 수준으로
          </span>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.ink, marginTop: 6}}>
            5월 1일부터 이자율 인하 제안
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const Question: React.FC = () => {
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
            fontSize: 54,
            fontWeight: 800,
            color: COLORS.ink,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            textAlign: 'center',
          }}
        >
          언제까지 이 이자를 줄 수 있나?
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const ILLUSION_STEPS = [
  {atFrame: 10, label: '규모가 커진다', icon: '📈'},
  {atFrame: 100, label: '검증됐다고 느낀다', icon: '✅'},
  {atFrame: 190, label: '가격도 오른다', icon: '💰'},
];

const SizeIllusion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = 1 + Math.min(Math.max(frame - 10, 0) / 300, 1) * 0.7;
  return (
    <AbsoluteFill>
      <Caption text="착시: 커질수록 안전해 보인다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: `4px solid ${COLORS.gold}`,
              background: 'rgba(216,180,90,0.12)',
              transform: `scale(${scale})`,
            }}
          />
          <div style={{display: 'flex', gap: 40}}>
            {ILLUSION_STEPS.map((s) => {
              const local = frame - s.atFrame;
              const reveal = spring({frame: local, fps, config: {damping: 14, stiffness: 160}, durationInFrames: 18});
              const opacity = interpolate(local, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    opacity,
                    transform: `translateY(${(1 - reveal) * 20}px)`,
                  }}
                >
                  <span style={{fontSize: 40}}>{s.icon}</span>
                  <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.ink}}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const LUNA_PEAK_POINTS = [
  {x: 0, y: 0.05},
  {x: 0.3, y: 0.15},
  {x: 0.6, y: 0.4},
  {x: 1, y: 1},
];

const LunaPeak: React.FC = () => (
  <AbsoluteFill>
    <Caption text="2022년 4월 5일" />
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
        <CrashChart
          points={LUNA_PEAK_POINTS}
          durationInFrames={220}
          width={1100}
          height={420}
          color={COLORS.accentGreen}
          labelFormatter={() => '$119.18'}
        />
        <div style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim, marginTop: 10}}>
          몇 센트짜리 코인이 100달러를 넘었다
        </div>
      </div>
    </Centered>
  </AbsoluteFill>
);

const THIN_POINTS = [
  {x: 0, y: 1},
  {x: 0.3, y: 0.75},
  {x: 0.5, y: 0.5},
  {x: 0.68, y: 0.3},
];

const CollateralThins: React.FC = () => {
  const frame = useCurrentFrame();
  const shieldOpacity = 1;
  const shieldScale = interpolate(frame, [0, 250], [1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="루나 하락 = 안전장치가 얇아진다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', alignItems: 'center', gap: 80}}>
          <CrashChart
            points={THIN_POINTS}
            durationInFrames={250}
            width={800}
            height={380}
            color={COLORS.accent}
            labelFormatter={() => '루나 ↓'}
          />
          <div
            style={{
              fontSize: 120,
              opacity: shieldOpacity,
              transform: `scale(${shieldScale})`,
            }}
          >
            🛡️
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part12Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.rateCutStart} durationInFrames={B.questionStart - B.rateCutStart}>
        <RateCutProposal />
      </Sequence>

      <Sequence from={B.questionStart} durationInFrames={B.illusionStart - B.questionStart}>
        <Question />
      </Sequence>

      <Sequence from={B.illusionStart} durationInFrames={B.peakStart - B.illusionStart}>
        <SizeIllusion />
      </Sequence>

      <Sequence from={B.peakStart} durationInFrames={B.thinsStart - B.peakStart}>
        <LunaPeak />
      </Sequence>

      <Sequence from={B.thinsStart} durationInFrames={B.end - B.thinsStart}>
        <CollateralThins />
      </Sequence>
    </AbsoluteFill>
  );
};
