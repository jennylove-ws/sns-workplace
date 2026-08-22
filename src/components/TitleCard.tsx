import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

// 코멧 트레일 마크: 점 하나가 옅어지는 궤적을 남기며 왼쪽 아래에서 오른쪽 위로 뻗는다.
// 채널 로고 마크(사용자 제공 레퍼런스 이미지 기준). 점이 순서대로 나타나며 궤적이 그려지는 것처럼 보이게 한다.
const CometTrailMark: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    {x: 0, y: 70, r: 13, opacity: 1},
    {x: 22, y: 52, r: 10, opacity: 0.85},
    {x: 40, y: 34, r: 8, opacity: 0.65},
    {x: 55, y: 20, r: 6, opacity: 0.45},
    {x: 67, y: 9, r: 4.5, opacity: 0.3},
    {x: 76, y: 0, r: 3, opacity: 0.18},
  ];
  return (
    <svg width={90} height={90} style={{overflow: 'visible'}}>
      {dots.map((d, i) => {
        const appear = interpolate(frame, [i * 4, i * 4 + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <circle
            key={i}
            cx={d.x}
            cy={90 - d.y}
            r={d.r * appear}
            fill={COLORS.accent}
            opacity={d.opacity * appear}
          />
        );
      })}
    </svg>
  );
};

export const TitleCard: React.FC<{
  title?: string;
  subtitle?: string;
  showMark?: boolean;
}> = ({title = '돈의 궤적', subtitle = '돈이 움직인 사건을 추적한다', showMark = false}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, 20], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {showMark && (
        <div style={{marginBottom: 8}}>
          <CometTrailMark />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 96,
          fontWeight: 800,
          color: COLORS.ink,
          letterSpacing: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: FONT_FAMILY,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.inkDim,
          letterSpacing: 2,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
