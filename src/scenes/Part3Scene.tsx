import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {VaultDoor} from '../components/VaultDoor';
import {Seesaw} from '../components/Seesaw';
import {SlideImage} from '../components/SlideImage';

// 파트03 오디오 구간(94.93s~136.83s) = 1258프레임
export const PART3_DURATION = 1258;

const B = {
  vaultStart: 0,
  emptyVaultStart: 345, // 11.5s
  codeStart: 427, // +2.74s
  seesawStart: 725, // +9.93s
  machineStart: 988, // +8.77s
  end: PART3_DURATION, // +9.0s
};

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </AbsoluteFill>
);

const PhotoBeat: React.FC<{
  src: string;
  caption?: string;
  durationInFrames: number;
  zoom?: 'in' | 'out';
}> = ({src, caption, durationInFrames, zoom = 'in'}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <SlideImage src={src} durationInFrames={durationInFrames} zoom={zoom} intensity={0.1} />
      {caption && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: textOpacity,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: FONT_FAMILY,
              fontSize: 44,
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

const VaultWithReserves: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [40, 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40}}>
      <VaultDoor openAtFrame={10} openDurationFrames={16} interiorText="달러 + 국채" />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          fontFamily: FONT_FAMILY,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.accentGreen,
          opacity,
        }}
      >
        담보가 있다
      </div>
    </AbsoluteFill>
  );
};

const PartnerSeesaw: React.FC = () => {
  const frame = useCurrentFrame();
  const balance = Math.sin(frame / 40) * 0.5;
  return (
    <Centered>
      <Seesaw balance={balance} leftLabel="UST" rightLabel="LUNA" />
    </Centered>
  );
};

const img = (name: string) => staticFile(`images/${name}`);

export const Part3Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* 담보가 있는 전통 스테이블코인: 금고 안에 달러+국채 — 모션그래픽 */}
      <Sequence from={B.vaultStart} durationInFrames={B.emptyVaultStart - B.vaultStart}>
        <VaultWithReserves />
      </Sequence>

      {/* UST에게는 이 금고가 없었다 — 사진(재사용: 텅 빈 금고) */}
      <Sequence from={B.emptyVaultStart} durationInFrames={B.codeStart - B.emptyVaultStart}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_sb57jzsb57jzsb57.png')}
          durationInFrames={B.codeStart - B.emptyVaultStart}
        />
      </Sequence>

      {/* 대신 코드를 넣었다: 알고리즘 스테이블코인 — 사진 */}
      <Sequence from={B.codeStart} durationInFrames={B.seesawStart - B.codeStart}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_c8zxzlc8zxzlc8zx.png')}
          caption="코드로 지킨다"
          durationInFrames={B.seesawStart - B.codeStart}
          zoom="out"
        />
      </Sequence>

      {/* UST와 루나, 짝꿍이자 안전장치 — 모션그래픽(시소) */}
      <Sequence from={B.seesawStart} durationInFrames={B.machineStart - B.seesawStart}>
        <PartnerSeesaw />
      </Sequence>

      {/* 자판기 한 대 — 사진 (핵심 비유 리빌) */}
      <Sequence from={B.machineStart} durationInFrames={B.end - B.machineStart}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_1bn17c1bn17c1bn1.png')}
          durationInFrames={B.end - B.machineStart}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
