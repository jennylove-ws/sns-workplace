import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {StepValue} from '../components/NumberDisplay';
import {ArbitrageFlow} from '../components/ArbitrageFlow';
import {Gear} from '../components/Gear';
import {SlideImage} from '../components/SlideImage';

// 파트06 오디오 구간(230.97s~278.73s) = 1433프레임
export const PART6_DURATION = 1433;

const B = {
  upStart: 0,
  downFlowStart: 290, // 9.66s
  downPriceStart: 556, // +8.87s
  gearStart: 806, // +8.33s
  founderStart: 1150, // +11.47s
  end: PART6_DURATION, // +9.43s
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

const PriceNormalize: React.FC<{from: string; to: string; caption: string}> = ({from, to, caption}) => (
  <AbsoluteFill>
    <Caption text={caption} color={COLORS.accentGreen} />
    <Centered>
      <StepValue steps={[{value: from, atFrame: 0}, {value: to, atFrame: 60}]} fontSize={170} />
    </Centered>
  </AbsoluteFill>
);

const ReverseArbitrage: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <AbsoluteFill>
    <Caption text="반대 상황도 똑같습니다" />
    <Centered>
      <ArbitrageFlow
        durationInFrames={durationInFrames - 20}
        steps={[
          {label: '시장가', value: '$1.02', color: COLORS.ink},
          {label: '루나 투입', value: '→', color: COLORS.inkDim},
          {label: 'UST 획득', value: '$1.00', color: COLORS.gold},
          {label: '시장 판매', value: '+$0.02', color: COLORS.accentGreen},
        ]}
      />
    </Centered>
  </AbsoluteFill>
);

const SelfCorrectingGears: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="아무도 지켜보지 않아도, 알아서 1달러에 맞춰진다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Gear size={200} teeth={10} rotationDeg={frame * 3} color={COLORS.gold} />
            <Gear size={140} teeth={8} rotationDeg={-frame * 3 * (200 / 140)} color={COLORS.accentGreen} />
          </div>
          <div style={{opacity, fontFamily: FONT_FAMILY, fontSize: 40, fontWeight: 800, color: COLORS.ink}}>
            자기 조정 시스템
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const PhotoBeat: React.FC<{src: string; caption?: string; durationInFrames: number}> = ({
  src,
  caption,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage src={src} durationInFrames={durationInFrames} zoom="in" intensity={0.1} />
      {caption && (
        <div style={{position: 'absolute', top: '30%', left: 0, right: 0, textAlign: 'center', opacity: textOpacity}}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT_FAMILY,
              fontSize: 40,
              fontWeight: 800,
              color: COLORS.gold,
              background: 'rgba(0,0,0,0.45)',
              borderRadius: 12,
              padding: '10px 28px',
            }}
          >
            {caption}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Part6Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.upStart} durationInFrames={B.downFlowStart - B.upStart}>
        <PriceNormalize from="$0.98" to="$1.00" caption="공급 감소 → 가격 상승" />
      </Sequence>

      <Sequence from={B.downFlowStart} durationInFrames={B.downPriceStart - B.downFlowStart}>
        <ReverseArbitrage durationInFrames={B.downPriceStart - B.downFlowStart} />
      </Sequence>

      <Sequence from={B.downPriceStart} durationInFrames={B.gearStart - B.downPriceStart}>
        <PriceNormalize from="$1.02" to="$1.00" caption="공급 증가 → 가격 하락" />
      </Sequence>

      <Sequence from={B.gearStart} durationInFrames={B.founderStart - B.gearStart}>
        <SelfCorrectingGears />
      </Sequence>

      <Sequence from={B.founderStart} durationInFrames={B.end - B.founderStart}>
        <PhotoBeat
          src={staticFile('images/Gemini_Generated_Image_aep39uaep39uaep3.png')}
          caption="설계자의 자신감"
          durationInFrames={B.end - B.founderStart}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
