import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, FPS} from '../constants';
import {StepValue, SpinningCounter} from '../components/NumberDisplay';
import {CrashChart} from '../components/CrashChart';
import {VaultDoor} from '../components/VaultDoor';
import {CenterLines} from '../components/CenterLines';
import {TitleCard} from '../components/TitleCard';

// 콜드 오픈 내레이션(파트01 전체 + 파트02 앞부분, "...1화 시작합니다."까지)의
// 실측 길이. public/audio/timeline.json 기준 프레임 1929 (=64.3초).
export const COLD_OPEN_DURATION = 1929;

// 원래는 대본 헤더의 "0:00~1:30"(90초) 추정치를 기준으로 비주얼 비트를
// 잡았는데, 실제 녹음은 그보다 훨씬 빠르게 지나간다. 모든 비트 타이밍에
// 같은 배율을 곱해 실제 길이에 맞춘다.
const SCALE = COLD_OPEN_DURATION / (90 * FPS);
const s = (origSec: number) => Math.round(origSec * FPS * SCALE);

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </AbsoluteFill>
);

const ThreeDaysFreeze: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Centered>
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 160,
          fontWeight: 800,
          color: COLORS.ink,
          opacity,
          letterSpacing: 2,
        }}
      >
        사흘
      </div>
    </Centered>
  );
};

const VaultBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [s(2), s(3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', gap: 40}}
    >
      <VaultDoor openAtFrame={0} openDurationFrames={14} interiorText="먼지뿐" />
      <div
        style={{
          position: 'absolute',
          bottom: 220,
          fontFamily: FONT_FAMILY,
          fontSize: 46,
          fontWeight: 800,
          color: COLORS.accent,
          opacity: textOpacity,
        }}
      >
        약 400억 달러 증발 · 우리 돈 50조 원
      </div>
    </AbsoluteFill>
  );
};

export const ColdOpen: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* $1.00 → $0.68 → $0.30 → $0.02 */}
      <Sequence from={0} durationInFrames={s(15)}>
        <Centered>
          <StepValue
            steps={[
              {value: '$1.00', atFrame: 0},
              {value: '$0.68', atFrame: s(8)},
              {value: '$0.30', atFrame: s(11)},
              {value: '$0.02', atFrame: s(13)},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 루나 절벽 붕괴 차트 */}
      <Sequence from={s(15)} durationInFrames={s(24) - s(15)}>
        <Centered>
          <CrashChart
            durationInFrames={s(8)}
            points={[
              {x: 0, y: 1},
              {x: 0.55, y: 0.97},
              {x: 0.66, y: 0.9},
              {x: 0.74, y: 0.55},
              {x: 0.84, y: 0.12},
              {x: 1, y: 0.01},
            ]}
            labelFormatter={(y) => `$${(y * 119).toFixed(2)}`}
          />
        </Centered>
      </Sequence>

      {/* 10억 → 6조 폭증 카운터 */}
      <Sequence from={s(24)} durationInFrames={s(32) - s(24)}>
        <Centered>
          <SpinningCounter from={1_000_000_000} to={6_000_000_000_000} durationInFrames={s(7)} />
        </Centered>
      </Sequence>

      {/* 텅 빈 금고 */}
      <Sequence from={s(32)} durationInFrames={s(42) - s(32)}>
        <VaultBeat />
      </Sequence>

      {/* 정지, "사흘" */}
      <Sequence from={s(42)} durationInFrames={s(48) - s(42)}>
        <ThreeDaysFreeze />
      </Sequence>

      {/* 흰 글씨 한 줄씩 */}
      <Sequence from={s(48)} durationInFrames={s(66) - s(48)}>
        <CenterLines
          lines={[
            {text: '그런데 이 사건, 정말 이상한 구석이 하나 있습니다.', startFrame: 0, endFrame: s(3.5)},
            {text: '도둑이 없어요.', startFrame: s(3.5), endFrame: s(6.5)},
            {
              text: '누가 금고를 턴 것도, 서버를 해킹한 것도 아닙니다.',
              startFrame: s(6.5),
              endFrame: s(10.5),
            },
            {
              text: '시스템은 설계도대로, 아주 성실하게 작동했습니다.',
              startFrame: s(10.5),
              endFrame: s(14.5),
            },
            {text: '설계도대로 작동했는데 50조가 사라졌습니다.', startFrame: s(14.5), endFrame: s(18)},
          ]}
        />
      </Sequence>

      {/* 되감기, 숫자 역순 상승 */}
      <Sequence from={s(66)} durationInFrames={s(78) - s(66)}>
        <Centered>
          <StepValue
            steps={[
              {value: '$0.02', atFrame: 0},
              {value: '$0.30', atFrame: s(3)},
              {value: '$0.68', atFrame: s(6)},
              {value: '$1.00', atFrame: s(9)},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 채널 로고 */}
      <Sequence from={s(78)} durationInFrames={COLD_OPEN_DURATION - s(78)}>
        <TitleCard />
      </Sequence>
    </AbsoluteFill>
  );
};
