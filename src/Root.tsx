import React from 'react';
import {Composition} from 'remotion';
import {MainVideo, TOTAL_DURATION_FRAMES} from './Composition';
import {FPS, WIDTH, HEIGHT} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
