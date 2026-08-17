import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {Seesaw} from '../components/Seesaw';
import {VaultDoor} from '../components/VaultDoor';
import {AnimatedWaveform} from '../components/AnimatedWaveform';

// 파트10 오디오 구간(412.2s~455.07s) = 1286프레임
export const PART10_DURATION = 1286;

const B = {
  imbalanceStart: 0,
  questionStart: 331, // 11.03s
  refillStart: 409, // +2.6s
  govStart: 736, // +10.9s
  coffeeStart: 996, // +8.67s
  end: PART10_DURATION, // +9.67s
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

const Imbalance: React.FC = () => {
  const frame = useCurrentFrame();
  const balance = interpolate(frame, [0, 60], [0, -0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="균형이 완전히 깨졌다" color={COLORS.accent} />
      <Centered>
        <Seesaw balance={balance} leftLabel="예치(산더미)" rightLabel="대출(조금)" />
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
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.ink,
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}
        >
          모자란 만큼은 어디서?
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const RefillVault: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % 90;
  const level = 1 - Math.min(cycle / 70, 1); // 서서히 바닥나다가 다시 채워짐
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="회사·재단 곳간에서 모자란 만큼 채운다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <VaultDoor openAtFrame={0} openDurationFrames={10} interiorText="회사 곳간" />
          <div style={{width: 260, height: 22, background: COLORS.panel, borderRadius: 11, overflow: 'hidden', opacity}}>
            <div
              style={{
                width: `${level * 100}%`,
                height: '100%',
                background: COLORS.gold,
                borderRadius: 11,
                transition: 'none',
              }}
            />
          </div>
          <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 26, fontWeight: 700, color: COLORS.inkDim}}>
            바닥나면 다시 부어 넣는다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const GovVsCompany: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const box: React.CSSProperties = {
    width: 300,
    height: 220,
    borderRadius: 20,
    background: COLORS.panel,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    opacity,
  };
  return (
    <AbsoluteFill>
      <Caption text="정부 지원금이 아니라, 순수한 회사 돈" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', gap: 60}}>
          <div style={{...box, border: `2px solid ${COLORS.accent}`}}>
            <span style={{fontSize: 48}}>🏛️</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, color: COLORS.accent}}>정부</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 44, fontWeight: 800, color: COLORS.accent}}>✕</span>
          </div>
          <div style={{...box, border: `2px solid ${COLORS.accentGreen}`}}>
            <span style={{fontSize: 48}}>🏢</span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 800, color: COLORS.accentGreen}}>
              회사·재단
            </span>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 44, fontWeight: 800, color: COLORS.accentGreen}}>
              ✓
            </span>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const CoffeeAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const flowT = interpolate(frame % 70, [0, 70], [0, 1]);
  const box: React.CSSProperties = {
    width: 240,
    height: 130,
    borderRadius: 16,
    background: COLORS.panel,
    border: `2px solid ${COLORS.line}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: 800,
    color: COLORS.ink,
    flexDirection: 'column',
    gap: 6,
  };
  return (
    <AbsoluteFill>
      <Caption text="새 카페의 공짜 커피 쿠폰과 똑같다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={box}>
              <span style={{fontSize: 34}}>🧑‍💼</span>
              사장님 주머니
            </div>
            <div style={{position: 'relative', width: 140, height: 6, background: COLORS.line, borderRadius: 3}}>
              <div
                style={{
                  position: 'absolute',
                  top: -9,
                  left: `${flowT * 85}%`,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: COLORS.gold,
                }}
              />
            </div>
            <div style={box}>
              <span style={{fontSize: 34}}>☕️</span>
              공짜 커피
            </div>
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.accentGreen}}>
            커피값은 손님이 아니라 사장님이 낸다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part10Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.imbalanceStart} durationInFrames={B.questionStart - B.imbalanceStart}>
        <Imbalance />
      </Sequence>

      <Sequence from={B.questionStart} durationInFrames={B.refillStart - B.questionStart}>
        <Question />
      </Sequence>

      <Sequence from={B.refillStart} durationInFrames={B.govStart - B.refillStart}>
        <RefillVault />
      </Sequence>

      <Sequence from={B.govStart} durationInFrames={B.coffeeStart - B.govStart}>
        <GovVsCompany />
      </Sequence>

      <Sequence from={B.coffeeStart} durationInFrames={B.end - B.coffeeStart}>
        <CoffeeAnalogy />
      </Sequence>
    </AbsoluteFill>
  );
};
