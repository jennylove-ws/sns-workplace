import React from 'react';
import {AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {CrashChart} from '../components/CrashChart';
import {CompareChart} from '../components/CompareChart';
import {SlideImage} from '../components/SlideImage';

// 파트02 오디오의 나머지 구간(콜드 오픈 끝~파트02 끝): 64.3s~94.93s = 919프레임
export const SECTION2_INTRO_DURATION = 919;

const B = {
  flatChartStart: 0,
  compareStart: 375, // 12.5s
  photoStart: 676, // +10.03s
  end: SECTION2_INTRO_DURATION, // +8.1s
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
}> = ({src, caption, durationInFrames}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <SlideImage src={src} durationInFrames={durationInFrames} zoom="in" intensity={0.1} />
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

export const Section2Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* 평평한 가격선 — "세상에서 제일 지루한 코인" — 모션그래픽 */}
      <Sequence from={B.flatChartStart} durationInFrames={B.compareStart - B.flatChartStart}>
        <Centered>
          <CrashChart
            durationInFrames={90}
            points={[
              {x: 0, y: 0.5},
              {x: 0.25, y: 0.52},
              {x: 0.5, y: 0.48},
              {x: 0.75, y: 0.51},
              {x: 1, y: 0.5},
            ]}
            labelFormatter={() => '$1.00'}
          />
        </Centered>
      </Sequence>

      {/* 비트코인(요동) vs 스테이블코인(평평) 비교 — 모션그래픽 */}
      <Sequence from={B.compareStart} durationInFrames={B.photoStart - B.compareStart}>
        <Centered>
          <CompareChart durationInFrames={150} />
        </Centered>
      </Sequence>

      {/* 백화점 상품권 비유: 창고에 진짜 물건이 있다 — 사진(재사용) */}
      <Sequence from={B.photoStart} durationInFrames={B.end - B.photoStart}>
        <PhotoBeat
          src={staticFile('images/Gemini_Generated_Image_zcp5ogzcp5ogzcp5.png')}
          caption="창고에 진짜 물건이 있다"
          durationInFrames={B.end - B.photoStart}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
