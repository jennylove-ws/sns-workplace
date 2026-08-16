import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ColdOpen, COLD_OPEN_DURATION} from './scenes/ColdOpen';

/**
 * 전체 영상 타임라인 조립부. 지금은 콜드 오픈(0:00~1:30)까지만 구현.
 * 이후 섹션(2~5장)을 만들 때마다 여기에 <Sequence>로 이어 붙인다.
 */
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={COLD_OPEN_DURATION}>
        <ColdOpen />
      </Sequence>
    </AbsoluteFill>
  );
};
