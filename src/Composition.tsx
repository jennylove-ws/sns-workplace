import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ColdOpen, COLD_OPEN_DURATION} from './scenes/ColdOpen';
import {Section2Intro, SECTION2_INTRO_DURATION} from './scenes/Section2Intro';
import {Part3Scene, PART3_DURATION} from './scenes/Part3Scene';
import {Part4Scene, PART4_DURATION} from './scenes/Part4Scene';
import {Part5Scene, PART5_DURATION} from './scenes/Part5Scene';
import {Part6Scene, PART6_DURATION} from './scenes/Part6Scene';
import {Part7Scene, PART7_DURATION} from './scenes/Part7Scene';
import {Part8Scene, PART8_DURATION} from './scenes/Part8Scene';
import {Part9Scene, PART9_DURATION} from './scenes/Part9Scene';
import {Part10Scene, PART10_DURATION} from './scenes/Part10Scene';
import {Part11Scene, PART11_DURATION} from './scenes/Part11Scene';
import {Part12Scene, PART12_DURATION} from './scenes/Part12Scene';
import {ImageReel} from './scenes/ImageReel';
import {AudioTrack} from './components/AudioTrack';
import {Subtitle} from './components/Subtitle';
import {fullSubtitles} from './data/subtitles.generated';
import {audioParts, TOTAL_DURATION_SEC} from './data/audioParts.generated';
import {FPS} from './constants';

export const TOTAL_DURATION_FRAMES = Math.round(TOTAL_DURATION_SEC * FPS);

// 오디오 파트의 실제 시작 시점(프레임). 파트 사이에 6-1.wav 같은 삽입 클립이
// 있으면 씬 길이를 단순 누적하는 것만으로는 다음 파트 시작점과 어긋나므로,
// 실측 오디오 타임라인에서 직접 가져온다.
const partStartFrame = (part: number) => {
  const p = audioParts.find((a) => a.part === part);
  if (!p) throw new Error(`audioParts에 파트 ${part} 없음`);
  return Math.round(p.startSec * FPS);
};

const SECTION2_INTRO_FROM = COLD_OPEN_DURATION;
const SECTION2_INTRO_END = SECTION2_INTRO_FROM + SECTION2_INTRO_DURATION;
const PART3_FROM = SECTION2_INTRO_END;
const PART3_END = PART3_FROM + PART3_DURATION;
const PART4_FROM = PART3_END;
const PART4_END = PART4_FROM + PART4_DURATION;
const PART5_FROM = PART4_END;
const PART5_END = PART5_FROM + PART5_DURATION;
const PART6_FROM = PART5_END;
const PART6_END = PART6_FROM + PART6_DURATION;
// 파트06과 파트07 사이에 6-1.wav(3.56초) 삽입 클립이 있어 실제 파트07 시작이
// 밀린다 — 그 간격은 임시로 이미지 릴로 채운다.
const PART7_FROM = partStartFrame(7);
const PART7_END = PART7_FROM + PART7_DURATION;
const PART8_FROM = PART7_END;
const PART8_END = PART8_FROM + PART8_DURATION;
const PART9_FROM = PART8_END;
const PART9_END = PART9_FROM + PART9_DURATION;
const PART10_FROM = PART9_END;
const PART10_END = PART10_FROM + PART10_DURATION;
const PART11_FROM = PART10_END;
const PART11_END = PART11_FROM + PART11_DURATION;
const PART12_FROM = PART11_END;
const PART12_END = PART12_FROM + PART12_DURATION;

/**
 * 전체 영상 타임라인 조립부.
 * - 콜드 오픈(0장), 2장 도입부(파트02 후반), 파트03~07은 실제 연출된 씬
 * - 그 뒤(파트08~)는 아직 장면별 연출이 없어 실사 이미지 릴로 임시 채움
 * - 오디오(1~25.wav + 6-1.wav)와 자막은 항상 전체 구간에 걸쳐 재생
 */
export const MainVideo: React.FC = () => {
  const restDuration = TOTAL_DURATION_FRAMES - PART12_END;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence from={0} durationInFrames={COLD_OPEN_DURATION}>
        <ColdOpen />
      </Sequence>

      <Sequence from={SECTION2_INTRO_FROM} durationInFrames={SECTION2_INTRO_DURATION}>
        <Section2Intro />
      </Sequence>

      <Sequence from={PART3_FROM} durationInFrames={PART3_DURATION}>
        <Part3Scene />
      </Sequence>

      <Sequence from={PART4_FROM} durationInFrames={PART4_DURATION}>
        <Part4Scene />
      </Sequence>

      <Sequence from={PART5_FROM} durationInFrames={PART5_DURATION}>
        <Part5Scene />
      </Sequence>

      <Sequence from={PART6_FROM} durationInFrames={PART6_DURATION}>
        <Part6Scene />
      </Sequence>

      {PART7_FROM > PART6_END && (
        <Sequence from={PART6_END} durationInFrames={PART7_FROM - PART6_END}>
          <ImageReel durationInFrames={PART7_FROM - PART6_END} />
        </Sequence>
      )}

      <Sequence from={PART7_FROM} durationInFrames={PART7_DURATION}>
        <Part7Scene />
      </Sequence>

      <Sequence from={PART8_FROM} durationInFrames={PART8_DURATION}>
        <Part8Scene />
      </Sequence>

      <Sequence from={PART9_FROM} durationInFrames={PART9_DURATION}>
        <Part9Scene />
      </Sequence>

      <Sequence from={PART10_FROM} durationInFrames={PART10_DURATION}>
        <Part10Scene />
      </Sequence>

      <Sequence from={PART11_FROM} durationInFrames={PART11_DURATION}>
        <Part11Scene />
      </Sequence>

      <Sequence from={PART12_FROM} durationInFrames={PART12_DURATION}>
        <Part12Scene />
      </Sequence>

      <Sequence from={PART12_END} durationInFrames={restDuration}>
        <ImageReel durationInFrames={restDuration} />
      </Sequence>

      <AudioTrack />
      <Subtitle lines={fullSubtitles} />
    </AbsoluteFill>
  );
};
