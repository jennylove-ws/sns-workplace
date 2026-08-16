import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';

type Direction = 'in' | 'out';
type Pan = 'none' | 'left' | 'right' | 'up' | 'down';

export const SlideImage: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: Direction;
  pan?: Pan;
  intensity?: number; // 0..1, how strong the move is
}> = ({src, durationInFrames, zoom = 'in', pan = 'none', intensity = 0.08}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scaleFrom = zoom === 'in' ? 1 : 1 + intensity;
  const scaleTo = zoom === 'in' ? 1 + intensity : 1;
  const scale = scaleFrom + (scaleTo - scaleFrom) * t;

  const panDistance = intensity * 100; // in % of extra space
  let translateX = 0;
  let translateY = 0;
  if (pan === 'left') translateX = panDistance * t - panDistance / 2;
  if (pan === 'right') translateX = -panDistance * t + panDistance / 2;
  if (pan === 'up') translateY = panDistance * t - panDistance / 2;
  if (pan === 'down') translateY = -panDistance * t + panDistance / 2;

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
