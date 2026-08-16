import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ColdOpen, COLD_OPEN_DURATION} from './scenes/ColdOpen';
import {Section2Intro, SECTION2_INTRO_DURATION} from './scenes/Section2Intro';
import {ImageReel} from './scenes/ImageReel';
import {AudioTrack} from './components/AudioTrack';
import {Subtitle} from './components/Subtitle';
import {fullSubtitles} from './data/subtitles.generated';
import {TOTAL_DURATION_SEC} from './data/audioParts.generated';
import {FPS} from './constants';

export const TOTAL_DURATION_FRAMES = Math.round(TOTAL_DURATION_SEC * FPS);

const SECTION2_INTRO_FROM = COLD_OPEN_DURATION;
const SECTION2_INTRO_END = SECTION2_INTRO_FROM + SECTION2_INTRO_DURATION;

/**
 * 전체 영상 타임라인 조립부.
 * - 콜드 오픈(0장)과 2장 도입부(파트02 후반)는 실제 연출된 씬
 * - 그 뒤(2장 나머지~5장)는 아직 장면별 연출이 없어 실사 이미지 릴로 임시 채움
 * - 오디오(1~25.wav)와 자막은 항상 전체 구간에 걸쳐 재생
 */
export const MainVideo: React.FC = () => {
  const restDuration = TOTAL_DURATION_FRAMES - SECTION2_INTRO_END;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={COLD_OPEN_DURATION}>
        <ColdOpen />
      </Sequence>

      <Sequence from={SECTION2_INTRO_FROM} durationInFrames={SECTION2_INTRO_DURATION}>
        <Section2Intro />
      </Sequence>

      <Sequence from={SECTION2_INTRO_END} durationInFrames={restDuration}>
        <ImageReel durationInFrames={restDuration} />
      </Sequence>

      <AudioTrack />
      <Subtitle lines={fullSubtitles} />
    </AbsoluteFill>
  );
};
