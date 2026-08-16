import React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {SlideImage} from '../components/SlideImage';
import {allImages} from '../data/allImages.generated';
import {FPS} from '../constants';

const HOLD_SEC = 6;

/**
 * 임시 가조립(assembly cut)용 이미지 릴. 2~5장 커스텀 씬이 아직 없는
 * 구간을 실사 이미지 켄번즈로 채워서, 대본 전체 구간에 최소한 그림이
 * 끊기지 않게 한다. 장면별 연출이 만들어지면 해당 구간을 교체할 것.
 */
export const ImageReel: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const holdFrames = HOLD_SEC * FPS;
  const count = Math.ceil(durationInFrames / holdFrames);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {Array.from({length: count}).map((_, i) => {
        const img = allImages[i % allImages.length];
        const from = i * holdFrames;
        const len = Math.min(holdFrames, durationInFrames - from);
        if (len <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <SlideImage
              src={staticFile(`images/${img}`)}
              durationInFrames={len}
              zoom={i % 2 === 0 ? 'in' : 'out'}
              pan={(['left', 'right', 'up', 'down'] as const)[i % 4]}
              intensity={0.1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
