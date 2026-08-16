import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ColdOpen, COLD_OPEN_DURATION} from './scenes/ColdOpen';
import {ImageReel} from './scenes/ImageReel';
import {AudioTrack} from './components/AudioTrack';
import {Subtitle} from './components/Subtitle';
import {fullSubtitles} from './data/subtitles.generated';
import {TOTAL_DURATION_SEC} from './data/audioParts.generated';
import {FPS} from './constants';

export const TOTAL_DURATION_FRAMES = Math.round(TOTAL_DURATION_SEC * FPS);

/**
 * 전체 영상 타임라인 조립부.
 * - 콜드 오픈(0장)은 실제 연출된 씬
 * - 그 뒤(2~5장)는 아직 장면별 연출이 없어 실사 이미지 릴로 임시 채움
 * - 오디오(1~25.wav)와 자막은 항상 전체 구간에 걸쳐 재생
 */
export const MainVideo: React.FC = () => {
  const restFrom = COLD_OPEN_DURATION;
  const restDuration = TOTAL_DURATION_FRAMES - restFrom;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={COLD_OPEN_DURATION}>
        <ColdOpen />
      </Sequence>

      <Sequence from={restFrom} durationInFrames={restDuration}>
        <ImageReel durationInFrames={restDuration} />
      </Sequence>

      <AudioTrack />
      <Subtitle lines={fullSubtitles} />
    </AbsoluteFill>
  );
};
