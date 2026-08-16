import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {StepValue, SpinningCounter} from '../components/NumberDisplay';
import {CrashChart} from '../components/CrashChart';
import {CenterLines} from '../components/CenterLines';
import {TitleCard} from '../components/TitleCard';
import {SlideImage} from '../components/SlideImage';

// 콜드 오픈 내레이션(파트01 전체 + 파트02 앞부분, "...1화 시작합니다."까지)의
// 실측 길이. public/audio/timeline.json 기준.
export const COLD_OPEN_DURATION = 1929; // 64.3초

// 비주얼 비트 경계(프레임). 사진↔모션그래픽이 번갈아 나오도록 구성.
const B = {
  crashStart: 0,
  chartStart: 315, // 10.5s
  photo1Start: 465, // +5s CrashChart
  counterStart: 570, // +3.5s Photo1(인쇄기)
  photo2Start: 705, // +4.5s Counter
  vaultPhotoStart: 810, // +3.5s Photo2(동전)
  freezeStart: 1065, // +8.5s VaultPhoto
  centerLines1Start: 1185, // +4s Freeze
  photo3Start: 1335, // +5s CenterLines1
  centerLines2Start: 1455, // +4s Photo3(자판기 내부)
  reverseStart: 1575, // +4s CenterLines2
  titleStart: 1800, // +7.5s Reverse
  end: COLD_OPEN_DURATION, // +4.3s Title
};

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

// 실사 이미지 비트. 강조 문구는 하단 자막과 겹치지 않도록 화면 중간에 띄운다.
const PhotoBeat: React.FC<{
  src: string;
  caption?: string;
  durationInFrames: number;
  zoom?: 'in' | 'out';
  captionTop?: string;
}> = ({src, caption, durationInFrames, zoom = 'in', captionTop = '38%'}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <SlideImage src={src} durationInFrames={durationInFrames} zoom={zoom} intensity={0.12} />
      {caption && (
        <div
          style={{
            position: 'absolute',
            top: captionTop,
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
              fontSize: 46,
              fontWeight: 800,
              color: COLORS.accent,
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

const img = (name: string) => staticFile(`images/${name}`);

export const ColdOpen: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* $1.00 → $0.68 → $0.30 → $0.02 — 모션그래픽 */}
      <Sequence from={B.crashStart} durationInFrames={B.chartStart - B.crashStart}>
        <Centered>
          <StepValue
            steps={[
              {value: '$1.00', atFrame: 0},
              {value: '$0.68', atFrame: 168},
              {value: '$0.30', atFrame: 231},
              {value: '$0.02', atFrame: 273},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 루나 절벽 붕괴 차트 — 모션그래픽 */}
      <Sequence from={B.chartStart} durationInFrames={B.photo1Start - B.chartStart}>
        <Centered>
          <CrashChart
            durationInFrames={120}
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

      {/* 돈이 찍혀 나오는 인쇄기 — 사진 */}
      <Sequence from={B.photo1Start} durationInFrames={B.counterStart - B.photo1Start}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_vwlpcevwlpcevwlp.png')}
          durationInFrames={B.counterStart - B.photo1Start}
          zoom="in"
        />
      </Sequence>

      {/* 10억 → 6조 폭증 카운터 — 모션그래픽 */}
      <Sequence from={B.counterStart} durationInFrames={B.photo2Start - B.counterStart}>
        <Centered>
          <SpinningCounter from={1_000_000_000} to={6_000_000_000_000} durationInFrames={120} />
        </Centered>
      </Sequence>

      {/* 쏟아지는 동전 더미 — 사진 */}
      <Sequence from={B.photo2Start} durationInFrames={B.vaultPhotoStart - B.photo2Start}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_gdaz67gdaz67gdaz.png')}
          durationInFrames={B.vaultPhotoStart - B.photo2Start}
          zoom="out"
        />
      </Sequence>

      {/* 텅 빈 금고 — 사진 (강조 문구는 화면 중간에) */}
      <Sequence from={B.vaultPhotoStart} durationInFrames={B.freezeStart - B.vaultPhotoStart}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_sb57jzsb57jzsb57.png')}
          caption="약 400억 달러 증발 · 우리 돈 50조 원"
          captionTop="30%"
          durationInFrames={B.freezeStart - B.vaultPhotoStart}
          zoom="in"
        />
      </Sequence>

      {/* 정지, "사흘" — 모션그래픽 */}
      <Sequence from={B.freezeStart} durationInFrames={B.centerLines1Start - B.freezeStart}>
        <ThreeDaysFreeze />
      </Sequence>

      {/* 흰 글씨 한 줄씩 (핵심 단어만 — 하단 자막과 중복 방지) — 모션그래픽 */}
      <Sequence from={B.centerLines1Start} durationInFrames={B.photo3Start - B.centerLines1Start}>
        <CenterLines
          lines={[
            {text: '이상한 구석', startFrame: 0, endFrame: 40},
            {text: '도둑이 없다', startFrame: 40, endFrame: 90},
            {text: '해킹도 아니다', startFrame: 90, endFrame: 150},
          ]}
        />
      </Sequence>

      {/* 자판기(시스템) 내부 — 사진: "설계도대로 작동했다" */}
      <Sequence from={B.photo3Start} durationInFrames={B.centerLines2Start - B.photo3Start}>
        <PhotoBeat
          src={img('Gemini_Generated_Image_zcp5ogzcp5ogzcp5.png')}
          durationInFrames={B.centerLines2Start - B.photo3Start}
          zoom="in"
        />
      </Sequence>

      {/* 흰 글씨 한 줄씩 (이어서) — 모션그래픽 */}
      <Sequence from={B.centerLines2Start} durationInFrames={B.reverseStart - B.centerLines2Start}>
        <CenterLines
          lines={[
            {text: '설계도대로 작동', startFrame: 0, endFrame: 55},
            {text: '50조가 사라졌다', startFrame: 55, endFrame: 120},
          ]}
        />
      </Sequence>

      {/* 되감기, 숫자 역순 상승 — 모션그래픽 */}
      <Sequence from={B.reverseStart} durationInFrames={B.titleStart - B.reverseStart}>
        <Centered>
          <StepValue
            steps={[
              {value: '$0.02', atFrame: 0},
              {value: '$0.30', atFrame: 56},
              {value: '$0.68', atFrame: 113},
              {value: '$1.00', atFrame: 169},
            ]}
          />
        </Centered>
      </Sequence>

      {/* 채널 로고 — 모션그래픽 */}
      <Sequence from={B.titleStart} durationInFrames={B.end - B.titleStart}>
        <TitleCard />
      </Sequence>
    </AbsoluteFill>
  );
};
