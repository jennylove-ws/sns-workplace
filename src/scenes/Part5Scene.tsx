import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {VendingMachine} from '../components/VendingMachine';
import {Seesaw} from '../components/Seesaw';
import {StepValue} from '../components/NumberDisplay';
import {ArbitrageFlow} from '../components/ArbitrageFlow';
import {SupplyLedger} from '../components/SupplyLedger';

// 파트05 오디오 구간(185.63s~230.97s) = 1360프레임
export const PART5_DURATION = 1360;

const B = {
  cutawayStart: 0,
  cycleStart: 182, // 6.07s
  seesawStart: 457, // +9.17s
  priceStart: 710, // +8.43s
  flowStart: 954, // +8.13s
  burnStart: 1148, // +6.47s
  end: PART5_DURATION, // +7.07s
};

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
);

const Caption: React.FC<{text: string; top?: string | number; color?: string}> = ({
  text,
  top = 150,
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

const CutawayLabel: React.FC = () => (
  <AbsoluteFill>
    <Caption text="자판기 = 파쇄기 + 인쇄기" />
    <Centered>
      <VendingMachine phase="idle" leftLabel="파쇄기" rightLabel="인쇄기" />
    </Centered>
  </AbsoluteFill>
);

const ExchangeCycle: React.FC = () => (
  <AbsoluteFill>
    <Caption text="루나 투입 → 태워짐 → UST 발행 / UST 투입 → 태워짐 → 루나 발행" />
    <Sequence from={0} durationInFrames={137}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <VendingMachine phase="luna-in" actionAtFrame={15} actionDurationFrames={90} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={137} durationInFrames={138}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <VendingMachine phase="ust-in" actionAtFrame={10} actionDurationFrames={90} />
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

const SeesawBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const balance = Math.sin(frame / 35) * 0.55;
  return (
    <AbsoluteFill>
      <Caption text="한쪽이 줄면 다른 쪽이 늘어난다" />
      <Centered>
        <Seesaw balance={balance} leftLabel="UST" rightLabel="LUNA" />
      </Centered>
    </AbsoluteFill>
  );
};

const PriceDip: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <AbsoluteFill>
    <Caption text="UST가 $0.98로 싸졌다면?" color={COLORS.accent} />
    <Centered>
      <StepValue
        steps={[
          {value: '$1.00', atFrame: 0},
          {value: '$0.98', atFrame: Math.round(durationInFrames * 0.35)},
        ]}
        fontSize={170}
      />
    </Centered>
  </AbsoluteFill>
);

const ArbitrageBeat: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <AbsoluteFill>
    <Caption text="눈치 빠른 사람의 용돈벌이" />
    <Centered>
      <ArbitrageFlow durationInFrames={durationInFrames - 20} />
    </Centered>
  </AbsoluteFill>
);

const BurnResult: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <AbsoluteFill>
    <Caption text="결과적으로 시장의 UST가 사라진다" color={COLORS.accent} />
    <Centered>
      <SupplyLedger mode="burn" durationInFrames={durationInFrames} startSupply={500} />
    </Centered>
  </AbsoluteFill>
);

export const Part5Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.cutawayStart} durationInFrames={B.cycleStart - B.cutawayStart}>
        <CutawayLabel />
      </Sequence>

      <Sequence from={B.cycleStart} durationInFrames={B.seesawStart - B.cycleStart}>
        <ExchangeCycle />
      </Sequence>

      <Sequence from={B.seesawStart} durationInFrames={B.priceStart - B.seesawStart}>
        <SeesawBeat />
      </Sequence>

      <Sequence from={B.priceStart} durationInFrames={B.flowStart - B.priceStart}>
        <PriceDip durationInFrames={B.flowStart - B.priceStart} />
      </Sequence>

      <Sequence from={B.flowStart} durationInFrames={B.burnStart - B.flowStart}>
        <ArbitrageBeat durationInFrames={B.burnStart - B.flowStart} />
      </Sequence>

      <Sequence from={B.burnStart} durationInFrames={B.end - B.burnStart}>
        <BurnResult durationInFrames={B.end - B.burnStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
