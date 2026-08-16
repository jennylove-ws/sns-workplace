import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './Composition';
import {FPS, WIDTH, HEIGHT} from './constants';
import {COLD_OPEN_DURATION} from './scenes/ColdOpen';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={COLD_OPEN_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
