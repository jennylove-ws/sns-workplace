import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {audioParts} from '../data/audioParts.generated';
import {FPS} from '../constants';

/** 25개(1~25.wav) 나레이션 파일을 실측 길이 그대로 이어 붙여 재생한다. */
export const AudioTrack: React.FC = () => {
  return (
    <>
      {audioParts.map((p) => (
        <Sequence
          key={p.part}
          from={Math.round(p.startSec * FPS)}
          durationInFrames={Math.round(p.durationSec * FPS) + 1}
        >
          <Audio src={staticFile(`audio/${p.file}`)} />
        </Sequence>
      ))}
    </>
  );
};
