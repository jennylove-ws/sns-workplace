import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {MoneyFlowDiagram} from '../components/MoneyFlowDiagram';

// 파트09 오디오 구간(371.0s~412.2s) = 1236프레임
export const PART9_DURATION = 1236;

const B = {
  flowStart: 0,
  reasonStart: 320, // 10.67s
  growthStart: 641, // +10.7s
  questionStart: 777, // +4.53s
  bankStart: 921, // +4.8s
  end: PART9_DURATION, // +10.5s
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

const BuyThenDeposit: React.FC = () => {
  const frame = useCurrentFrame();
  const arrowT = interpolate(frame % 70, [0, 70], [0, 1]);
  const box: React.CSSProperties = {
    width: 260,
    height: 140,
    borderRadius: 18,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    fontWeight: 800,
    color: COLORS.ink,
  };
  return (
    <AbsoluteFill>
      <Caption text="UST만 사면 이자는 0원 · 앵커에 맡겨야 붙는다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={box}>UST 구매</div>
            <div style={{position: 'relative', width: 140, height: 6, background: COLORS.line, borderRadius: 3}}>
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: `${arrowT * 85}%`,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: COLORS.gold,
                }}
              />
            </div>
            <div style={{...box, borderColor: COLORS.gold}}>앵커 예치</div>
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.accentGreen}}>
            사자마자 바로 앵커로 직행
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const OnlyReason: React.FC = () => (
  <Centered>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
      <div style={{fontFamily: FONT_FAMILY, fontSize: 150, fontWeight: 800, color: COLORS.gold}}>19.5%</div>
      <div style={{fontFamily: FONT_FAMILY, fontSize: 36, fontWeight: 700, color: COLORS.ink}}>
        UST를 살 유일한 이유
      </div>
    </div>
  </Centered>
);

const EcosystemGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.min(frame / 130, 1) * 0.9;
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `4px solid ${COLORS.gold}`,
            background: 'rgba(216,180,90,0.12)',
            transform: `scale(${scale})`,
          }}
        />
        <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 38, fontWeight: 800, color: COLORS.ink}}>
          발행 ↑ · 생태계 ↑
        </div>
      </div>
    </Centered>
  );
};

const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
          그 이자, 대체 누가 주는 겁니까?
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const BankFlow: React.FC = () => (
  <AbsoluteFill>
    <Caption text="원래 은행은 이렇게 굴러간다" />
    <Centered>
      <MoneyFlowDiagram />
    </Centered>
  </AbsoluteFill>
);

export const Part9Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.flowStart} durationInFrames={B.reasonStart - B.flowStart}>
        <BuyThenDeposit />
      </Sequence>

      <Sequence from={B.reasonStart} durationInFrames={B.growthStart - B.reasonStart}>
        <OnlyReason />
      </Sequence>

      <Sequence from={B.growthStart} durationInFrames={B.questionStart - B.growthStart}>
        <EcosystemGrowth />
      </Sequence>

      <Sequence from={B.questionStart} durationInFrames={B.bankStart - B.questionStart}>
        <Question />
      </Sequence>

      <Sequence from={B.bankStart} durationInFrames={B.end - B.bankStart}>
        <BankFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
