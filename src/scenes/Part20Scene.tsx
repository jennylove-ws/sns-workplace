import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {AnimatedWaveform} from '../components/AnimatedWaveform';
import {Gear} from '../components/Gear';
import {SlideImage} from '../components/SlideImage';

// 파트20 오디오 구간(851.64s~900.24s) = 1458프레임
export const PART20_DURATION = 1458;

const B = {
  causesStart: 0,
  flipStart: 450, // 15s
  gearsPeopleStart: 717, // +8.9s
  imagineStart: 952, // +7.83s
  coinsStart: 1012, // +2s
  pitchStart: 1206, // +6.47s
  end: PART20_DURATION, // +8.4s
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

const CAUSES = [
  {label: '감당 못 할\n수익률', angle: -135},
  {label: '루나 하나뿐인 담보', angle: -45},
  {label: '식어가던 시장', angle: 135},
  {label: '한꺼번에 몰린 출금', angle: 45},
];

const FourCauses: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const radius = 260;
  return (
    <AbsoluteFill>
      <Caption text="누가 작정하고 벌인 일이 아니다" />
      <Centered>
        <div style={{position: 'relative', width: 680, height: 460}}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: `3px solid ${COLORS.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 800,
              color: COLORS.accent,
              textAlign: 'center',
            }}
          >
            붕괴
          </div>
          {CAUSES.map((c, i) => {
            const atFrame = 30 + i * 90;
            const reveal = spring({
              frame: frame - atFrame,
              fps,
              config: {damping: 14, stiffness: 150},
              durationInFrames: 20,
            });
            const rad = (c.angle * Math.PI) / 180;
            const x = 340 + radius * Math.cos(rad);
            const y = 230 + radius * Math.sin(rad) * 0.72;
            return (
              <div
                key={c.label}
                style={{
                  position: 'absolute',
                  left: x - 100,
                  top: y - 30,
                  width: 200,
                  opacity: reveal,
                  transform: `scale(${0.7 + reveal * 0.3})`,
                  textAlign: 'center',
                  fontFamily: FONT_FAMILY,
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.gold,
                  background: 'rgba(23,23,26,0.9)',
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  whiteSpace: 'pre-line',
                }}
              >
                {c.label}
              </div>
            );
          })}
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const CollateralFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flipT = interpolate(frame, [80, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="UST는 1달러를 잃었다" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity}}>
          <div style={{position: 'relative', width: 620, height: 140}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 28,
                whiteSpace: 'nowrap',
                opacity: 1 - flipT,
              }}
            >
              <span style={{fontSize: 60}}>🛡️</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.inkDim}}>
                충격을 막아주는 루나
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 28,
                whiteSpace: 'nowrap',
                opacity: flipT,
              }}
            >
              <span style={{fontSize: 60}}>🌊</span>
              <span style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 700, color: COLORS.accent}}>
                손실이 쏟아지는 루나
              </span>
            </div>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const PeopleAmongGears: React.FC = () => {
  const frame = useCurrentFrame();
  const personOpacity = interpolate(frame, [90, 130], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const personScale = interpolate(frame, [90, 150], [0.7, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="자판기, 저울, 톱니바퀴 — 그 사이에 사람이 있었다" color={COLORS.gold} />
      <Centered>
        <div style={{position: 'relative', width: 400, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{position: 'absolute', left: 20, top: 10, opacity: 0.45}}>
            <Gear size={210} teeth={10} rotationDeg={frame * 1.4} color={COLORS.inkDim} />
          </div>
          <div style={{position: 'absolute', right: 20, bottom: 10, opacity: 0.45}}>
            <Gear size={180} teeth={9} rotationDeg={frame * -1.6} color={COLORS.inkDim} />
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              opacity: personOpacity,
              transform: `scale(${personScale})`,
              fontSize: 70,
              filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.9))',
            }}
          >
            🧍
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const ImagineThis: React.FC = () => {
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
          }}
        >
          한번 이렇게 상상해 보시죠
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const DontKnowCoins: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const l1 = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l2 = interpolate(frame, [60, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l3 = interpolate(frame, [120, 145], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_nkh61jnkh61jnkh6.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.08}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,12,0.62)'}} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
          <div style={{opacity: l1, fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 700, color: COLORS.ink}}>
            코인은 잘 모릅니다
          </div>
          <div style={{opacity: l2, fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 700, color: COLORS.ink}}>
            비트코인은 무섭다고 들었어요
          </div>
          <div style={{opacity: l3, fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 700, color: COLORS.accent}}>
            하루에 몇십 퍼센트씩 빠진다니까요
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const PitchQuote: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubbleReveal = spring({frame: frame - 40, fps, config: {damping: 14, stiffness: 150}, durationInFrames: 20});
  const l2 = interpolate(frame, [95, 120], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l3 = interpolate(frame, [155, 180], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_cyp4l1cyp4l1cyp4.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.1}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,12,0.45)'}} />
      <Caption text="그런데 누가 이런 걸 알려줍니다" />
      <Centered>
        <div
          style={{
            opacity: bubbleReveal,
            transform: `scale(${0.85 + bubbleReveal * 0.15})`,
            background: 'rgba(10,10,12,0.8)',
            border: `2px solid ${COLORS.gold}`,
            borderRadius: '24px 24px 24px 4px',
            padding: '36px 50px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 900,
          }}
        >
          <div style={{opacity: l2, fontFamily: FONT_FAMILY, fontSize: 32, fontWeight: 700, color: COLORS.ink}}>
            "이건 가격이 안 움직여. 1달러에 딱 고정돼 있어."
          </div>
          <div style={{opacity: l3, fontFamily: FONT_FAMILY, fontSize: 44, fontWeight: 800, color: COLORS.gold}}>
            "근데 이자를 20% 줘."
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part20Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.causesStart} durationInFrames={B.flipStart - B.causesStart}>
        <FourCauses />
      </Sequence>

      <Sequence from={B.flipStart} durationInFrames={B.gearsPeopleStart - B.flipStart}>
        <CollateralFlip />
      </Sequence>

      <Sequence from={B.gearsPeopleStart} durationInFrames={B.imagineStart - B.gearsPeopleStart}>
        <PeopleAmongGears />
      </Sequence>

      <Sequence from={B.imagineStart} durationInFrames={B.coinsStart - B.imagineStart}>
        <ImagineThis />
      </Sequence>

      <Sequence from={B.coinsStart} durationInFrames={B.pitchStart - B.coinsStart}>
        <DontKnowCoins durationInFrames={B.pitchStart - B.coinsStart} />
      </Sequence>

      <Sequence from={B.pitchStart} durationInFrames={B.end - B.pitchStart}>
        <PitchQuote durationInFrames={B.end - B.pitchStart} />
      </Sequence>
    </AbsoluteFill>
  );
};
