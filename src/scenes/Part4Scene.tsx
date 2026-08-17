import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {VendingMachine} from '../components/VendingMachine';
import {SupplyLedger} from '../components/SupplyLedger';
import {SlideImage} from '../components/SlideImage';

// 파트04 오디오 구간(136.83s~185.63s) = 1464프레임
export const PART4_DURATION = 1464;

const B = {
  exchangeStart: 0,
  statusStart: 298, // 9.94s
  burnIntroStart: 531, // +7.76s
  sellStart: 813, // +9.4s
  burnStart: 1046, // +7.77s
  photoStart: 1386, // +11.33s
  end: PART4_DURATION, // +2.6s
};

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </AbsoluteFill>
);

// 자판기 교환: UST→LUNA, LUNA→UST 를 번갈아 보여주며 "무조건 교환된다"는
// 정보를 숫자·화살표 라벨로 함께 표시한다.
const ExchangeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const infoOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: infoOpacity,
          fontFamily: FONT_FAMILY,
          fontSize: 34,
          fontWeight: 700,
          color: COLORS.gold,
        }}
      >
        UST 1개 ⇄ 1달러어치 LUNA · 누가 오든, 가격이 얼마든 100% 교환
      </div>
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <VendingMachine phase="ust-in" actionAtFrame={20} actionDurationFrames={90} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={150} durationInFrames={148}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <VendingMachine phase="luna-in" actionAtFrame={10} actionDurationFrames={90} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

const StatusBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin(frame / 12));
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: COLORS.accentGreen,
              opacity: pulse,
              boxShadow: `0 0 ${16 * pulse}px ${COLORS.accentGreen}`,
            }}
          />
          <span style={{fontFamily: FONT_FAMILY, fontSize: 44, fontWeight: 800, color: COLORS.ink}}>
            24시간 가동 중
          </span>
        </div>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 700, color: COLORS.gold}}>
          금고 잔액: $0 · 무제한 교환
        </div>
      </div>
    </Centered>
  );
};

const BurnIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flame = interpolate(frame % 60, [0, 30, 60], [1, 1.15, 1]);
  return (
    <Centered>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, opacity}}>
        <div style={{fontSize: 90, transform: `scale(${flame})`}}>🔥</div>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 52, fontWeight: 800, color: COLORS.ink}}>
          "태운다" = 소각
        </div>
        <div style={{fontFamily: FONT_FAMILY, fontSize: 30, fontWeight: 600, color: COLORS.inkDim}}>
          여기서 헷갈리면 뒤가 통째로 꼬입니다
        </div>
      </div>
    </Centered>
  );
};

const PhotoBeat: React.FC<{src: string; caption?: string; durationInFrames: number}> = ({
  src,
  caption,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage src={src} durationInFrames={durationInFrames} zoom="in" intensity={0.08} />
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

export const Part4Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* UST⇄LUNA 교환 시연 — 모션그래픽(정보 라벨 포함) */}
      <Sequence from={B.exchangeStart} durationInFrames={B.statusStart - B.exchangeStart}>
        <ExchangeDemo />
      </Sequence>

      {/* 금고엔 달러가 없다, 자판기는 절대 안 멈춘다 — 모션그래픽 */}
      <Sequence from={B.statusStart} durationInFrames={B.burnIntroStart - B.statusStart}>
        <StatusBadge />
      </Sequence>

      {/* "태운다" 개념 도입 — 모션그래픽 */}
      <Sequence from={B.burnIntroStart} durationInFrames={B.sellStart - B.burnIntroStart}>
        <BurnIntro />
      </Sequence>

      {/* 판다 = 소유권 이동, 총량 불변 — 모션그래픽(발행량 카운터) */}
      <Sequence from={B.sellStart} durationInFrames={B.burnStart - B.sellStart}>
        <Centered>
          <SupplyLedger mode="sell" durationInFrames={B.burnStart - B.sellStart} />
        </Centered>
      </Sequence>

      {/* 태운다 = 총량 감소 — 모션그래픽(발행량 카운터 감소) */}
      <Sequence from={B.burnStart} durationInFrames={B.photoStart - B.burnStart}>
        <Centered>
          <SupplyLedger mode="burn" durationInFrames={B.photoStart - B.burnStart} />
        </Centered>
      </Sequence>

      {/* 한국은행 파쇄 비유 — 사진(재사용) */}
      <Sequence from={B.photoStart} durationInFrames={B.end - B.photoStart}>
        <PhotoBeat
          src={staticFile('images/Gemini_Generated_Image_vwlpcevwlpcevwlp.png')}
          caption="파는 게 아니라 없애는 것"
          durationInFrames={B.end - B.photoStart}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
