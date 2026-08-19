import React from 'react';
import {Composition} from 'remotion';
import {MainVideo, COMPOSITION_DURATION_FRAMES} from './Composition';
import {FPS, WIDTH, HEIGHT} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={COMPOSITION_DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
