import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {VendingMachine} from '../components/VendingMachine';
import {VaultDoor} from '../components/VaultDoor';
import {TrustChain} from '../components/TrustChain';

// 파트07 오디오 구간(282.27s~329.77s) = 1425프레임
export const PART7_DURATION = 1425;

const B = {
  signStart: 0,
  revealStart: 366, // 12.2s
  chainStart: 653, // +9.56s
  shakeStart: 1195, // +18.07s
  end: PART7_DURATION, // +7.67s
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

const SignReread: React.FC = () => (
  <AbsoluteFill>
    <Caption text="자판기 안내문, 다시 한번 읽어봅니다" />
    <Centered>
      <VendingMachine phase="idle" />
    </Centered>
  </AbsoluteFill>
);

const BackdoorReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [50, 65], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 36}}>
      <Caption text="자판기 안에 달러가 있을까?" color={COLORS.accent} />
      <VaultDoor openAtFrame={15} openDurationFrames={16} interiorText="루나뿐" />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.accent,
          opacity,
        }}
      >
        달러 0장 · 전제는 "루나 = 1달러"
      </div>
    </AbsoluteFill>
  );
};

const ChainStable: React.FC = () => (
  <AbsoluteFill>
    <Caption text="진짜 담보는 달러가 아니라 루나 가격이었다" />
    <Centered>
      <TrustChain
        links={[
          {label: 'UST', sub: '1달러 약속'},
          {label: 'LUNA', sub: '루나 가격이 담보'},
          {label: '믿음', sub: '테라가 잘될 거라는'},
        ]}
        mode="stable"
      />
    </Centered>
  </AbsoluteFill>
);

const ChainShaking: React.FC = () => (
  <AbsoluteFill>
    <Caption text="믿음이 흔들리면, 담보도 같이 흔들린다" color={COLORS.accent} />
    <Centered>
      <TrustChain
        links={[
          {label: 'UST', sub: '1달러 약속'},
          {label: 'LUNA', sub: '루나 가격이 담보'},
          {label: '믿음', sub: '흔들리는 중...'},
        ]}
        mode="shaking"
      />
    </Centered>
  </AbsoluteFill>
);

export const Part7Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.signStart} durationInFrames={B.revealStart - B.signStart}>
        <SignReread />
      </Sequence>

      <Sequence from={B.revealStart} durationInFrames={B.chainStart - B.revealStart}>
        <BackdoorReveal />
      </Sequence>

      <Sequence from={B.chainStart} durationInFrames={B.shakeStart - B.chainStart}>
        <ChainStable />
      </Sequence>

      <Sequence from={B.shakeStart} durationInFrames={B.end - B.shakeStart}>
        <ChainShaking />
      </Sequence>
    </AbsoluteFill>
  );
};
