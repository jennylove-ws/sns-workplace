import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {StepValue} from '../components/NumberDisplay';

// 파트11 오디오 구간(455.08s~496.08s) = 1230프레임
export const PART11_DURATION = 1230;

const B = {
  paperStart: 0,
  dailyStart: 435, // 14.5s
  monthStart: 676, // +8.03s
  notScamStart: 789, // +3.77s
  conclusionStart: 1028, // +7.97s
  end: PART11_DURATION, // +6.73s
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

const ROWS = ['거래 기록 전수 재구성', '일별 자금 흐름 분석', '앵커 예치·인출 내역'];

const PaperAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Caption text="블록체인 전수 분석 논문" />
      <Centered>
        <div
          style={{
            width: 640,
            borderRadius: 20,
            background: COLORS.panel,
            border: `2px solid ${COLORS.line}`,
            padding: '40px 50px',
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
          }}
        >
          {ROWS.map((row, i) => {
            const atFrame = 20 + i * 45;
            const local = frame - atFrame;
            const reveal = spring({frame: local, fps, config: {damping: 14, stiffness: 160}, durationInFrames: 18});
            const opacity = interpolate(local, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div
                key={row}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  opacity,
                  transform: `translateX(${(1 - reveal) * -40}px)`,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: reveal > 0.6 ? COLORS.accentGreen : COLORS.line,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: COLORS.bg,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {reveal > 0.6 ? '✓' : ''}
                </span>
                <span style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.ink}}>{row}</span>
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const DailyBurn: React.FC = () => (
  <AbsoluteFill>
    <Caption text="앵커가 하루에 메워야 했던 돈 (2022년 4월 기준)" />
    <Centered>
      <StepValue
        steps={[
          {value: '하루 $600만', atFrame: 0},
          {value: '하루 80억 원', atFrame: 130},
        ]}
        fontSize={110}
        color={COLORS.accent}
      />
    </Centered>
  </AbsoluteFill>
);

const MonthTotal: React.FC = () => (
  <AbsoluteFill>
    <Caption text="한 달이면" />
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <StepValue steps={[{value: '2,400억 원', atFrame: 0}]} fontSize={140} color={COLORS.accent} />
        <div style={{fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 700, color: COLORS.inkDim}}>
          전부 이자로 나갑니다
        </div>
      </div>
    </Centered>
  </AbsoluteFill>
);

const NotScam: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subOpacity = interpolate(frame, [70, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AnimatedWaveform />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <div
            style={{
              opacity,
              fontFamily: FONT_FAMILY,
              fontSize: 50,
              fontWeight: 800,
              color: COLORS.ink,
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            이것만으로 사기라곤 할 수 없다
          </div>
          <div
            style={{
              opacity: subOpacity,
              fontFamily: FONT_FAMILY,
              fontSize: 30,
              fontWeight: 700,
              color: COLORS.gold,
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            초기 서비스 마케팅비는 흔한 일
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const flowT = interpolate(frame % 70, [0, 70], [0, 1]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const box: React.CSSProperties = {
    width: 280,
    height: 150,
    borderRadius: 18,
    background: COLORS.panel,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: FONT_FAMILY,
    fontWeight: 800,
    opacity,
  };
  return (
    <AbsoluteFill>
      <Caption text="누가 계속 부어줘야 유지되는 숫자였다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{...box, border: `2px solid ${COLORS.line}`}}>
              <span style={{fontSize: 34}}>💸</span>
              <span style={{fontSize: 26, color: COLORS.ink}}>외부 자금</span>
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
                  background: COLORS.accent,
                }}
              />
            </div>
            <div style={{...box, border: `2px solid ${COLORS.accent}`}}>
              <span style={{fontSize: 34, color: COLORS.ink}}>19.5%</span>
              <span style={{fontSize: 24, color: COLORS.accent}}>이자</span>
            </div>
          </div>
          <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: 700, color: COLORS.inkDim}}>
            시스템이 스스로 벌어낸 돈이 아니다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part11Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.paperStart} durationInFrames={B.dailyStart - B.paperStart}>
        <PaperAnalysis />
      </Sequence>

      <Sequence from={B.dailyStart} durationInFrames={B.monthStart - B.dailyStart}>
        <DailyBurn />
      </Sequence>

      <Sequence from={B.monthStart} durationInFrames={B.notScamStart - B.monthStart}>
        <MonthTotal />
      </Sequence>

      <Sequence from={B.notScamStart} durationInFrames={B.conclusionStart - B.notScamStart}>
        <NotScam />
      </Sequence>

      <Sequence from={B.conclusionStart} durationInFrames={B.end - B.conclusionStart}>
        <Conclusion />
      </Sequence>
    </AbsoluteFill>
  );
};
