import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, sec} from '../constants';
import {StepValue, SpinningCounter} from '../components/NumberDisplay';
import {CrashChart} from '../components/CrashChart';
import {VaultDoor} from '../components/VaultDoor';
import {CenterLines} from '../components/CenterLines';
import {TitleCard} from '../components/TitleCard';
import {Subtitle} from '../components/Subtitle';
import {coldOpenSubtitles} from '../data/coldOpenSubtitles';

export const COLD_OPEN_DURATION = sec(90);

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
  const textOpacity = interpolate(frame, [sec(2), sec(3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', gap: 40}}
    >
      <VaultDoor openAtFrame={0} openDurationFrames={16} interiorText="먼지뿐" />
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
      {/* 0:00~0:15 — $1.00 → $0.68 → $0.30 → $0.02 */}
      <Sequence from={0} durationInFrames={sec(15)}>
        <Centered>
          <StepValue
            steps={[
              {value: '$1.00', atFrame: 0},
              {value: '$0.68', atFrame: sec(8)},
              {value: '$0.30', atFrame: sec(11)},
              {value: '$0.02', atFrame: sec(13)},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 0:15~0:24 — 루나 절벽 붕괴 차트 */}
      <Sequence from={sec(15)} durationInFrames={sec(9)}>
        <Centered>
          <CrashChart
            durationInFrames={sec(8)}
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

      {/* 0:24~0:32 — 10억 → 6조 폭증 카운터 */}
      <Sequence from={sec(24)} durationInFrames={sec(8)}>
        <Centered>
          <SpinningCounter from={1_000_000_000} to={6_000_000_000_000} durationInFrames={sec(7)} />
        </Centered>
      </Sequence>

      {/* 0:32~0:42 — 텅 빈 금고 */}
      <Sequence from={sec(32)} durationInFrames={sec(10)}>
        <VaultBeat />
      </Sequence>

      {/* 0:42~0:48 — 정지, "사흘" */}
      <Sequence from={sec(42)} durationInFrames={sec(6)}>
        <ThreeDaysFreeze />
      </Sequence>

      {/* 0:48~1:06 — 흰 글씨 한 줄씩 */}
      <Sequence from={sec(48)} durationInFrames={sec(18)}>
        <CenterLines
          lines={[
            {text: '그런데 이 사건, 정말 이상한 구석이 하나 있습니다.', startFrame: 0, endFrame: sec(3.5)},
            {text: '도둑이 없어요.', startFrame: sec(3.5), endFrame: sec(6.5)},
            {
              text: '누가 금고를 턴 것도, 서버를 해킹한 것도 아닙니다.',
              startFrame: sec(6.5),
              endFrame: sec(10.5),
            },
            {
              text: '시스템은 설계도대로, 아주 성실하게 작동했습니다.',
              startFrame: sec(10.5),
              endFrame: sec(14.5),
            },
            {text: '설계도대로 작동했는데 50조가 사라졌습니다.', startFrame: sec(14.5), endFrame: sec(18)},
          ]}
        />
      </Sequence>

      {/* 1:06~1:18 — 되감기, 숫자 역순 상승 */}
      <Sequence from={sec(66)} durationInFrames={sec(12)}>
        <Centered>
          <StepValue
            steps={[
              {value: '$0.02', atFrame: 0},
              {value: '$0.30', atFrame: sec(3)},
              {value: '$0.68', atFrame: sec(6)},
              {value: '$1.00', atFrame: sec(9)},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 1:18~1:30 — 채널 로고 */}
      <Sequence from={sec(78)} durationInFrames={sec(12)}>
        <TitleCard />
      </Sequence>

      {/* 자막 트랙 (전체 구간 공통) */}
      <Subtitle lines={coldOpenSubtitles} />
    </AbsoluteFill>
  );
};
