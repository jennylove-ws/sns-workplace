import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';
import {SlideImage} from '../components/SlideImage';

// 파트14 오디오 구간(586.36s~633.2s) = 1405프레임
export const PART14_DURATION = 1405;

const B = {
  gapStart: 0,
  raceStart: 303, // 10.1s
  promiseStart: 605, // +10.07s
  eventStart: 845, // +8s
  watchedStart: 1213, // +12.27s
  end: PART14_DURATION, // +6.4s
};

const Centered: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
);

const Caption: React.FC<{text: string; top?: string | number; color?: string}> = ({
  text,
  top = 130,
  color = COLORS.gold,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        fontFamily: FONT_FAMILY,
        fontSize: 34,
        fontWeight: 700,
        color,
      }}
    >
      {text}
    </div>
  );
};

const GRID_NUMS = ['482.1', '90.4K', '3.7M', '0.98', '119.2', '55.6', '2,400', '19.5', '600K'];

const TransparentVsUnderstand: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fogOpacity = interpolate(frame, [40, 90], [0, 0.94], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <SlideImage
        src={staticFile('images/Gemini_Generated_Image_r1iaptr1iaptr1ia.png')}
        durationInFrames={durationInFrames}
        zoom="in"
        intensity={0.08}
      />
      <AbsoluteFill style={{background: 'rgba(10,10,12,0.6)'}} />
      <Caption text="다 보인다고, 구조까지 보이는 건 아니다" color={COLORS.accent} />
      <Centered>
        <div style={{position: 'relative', width: 620, height: 380}}>
          <div
            style={{
              opacity,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              width: '100%',
              height: '100%',
            }}
          >
            {GRID_NUMS.map((n) => (
              <div
                key={n}
                style={{
                  background: COLORS.panel,
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_FAMILY,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.inkDim,
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `rgba(10,10,12,${fogOpacity})`,
              borderRadius: 16,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 60,
                fontWeight: 800,
                color: COLORS.accent,
                opacity: fogOpacity > 0.4 ? 1 : 0,
              }}
            >
              구조 = ?
            </span>
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const InfoGapRace: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const earlyT = interpolate(frame, [20, 160], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lateLocal = frame - 100;
  const lateT = interpolate(lateLocal, [0, 220], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const resultReveal = spring({frame: frame - 260, fps, config: {damping: 14, stiffness: 150}, durationInFrames: 20});
  return (
    <AbsoluteFill>
      <Caption text="정보가 빠른 쪽이 먼저 빠져나갔다" />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', gap: 50, width: 900}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim, width: 160}}>
              정보 빠른 쪽
            </span>
            <div style={{flex: 1, height: 10, background: COLORS.line, borderRadius: 5, position: 'relative'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${earlyT * 100}%`,
                  background: COLORS.accentGreen,
                  borderRadius: 5,
                }}
              />
            </div>
            <span style={{fontSize: 32, opacity: resultReveal}}>{resultReveal > 0.5 ? '✅' : ''}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <span style={{fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: 700, color: COLORS.inkDim, width: 160}}>
              늦게 움직인 쪽
            </span>
            <div style={{flex: 1, height: 10, background: COLORS.line, borderRadius: 5, position: 'relative'}}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${lateT * 100}%`,
                  background: COLORS.accent,
                  borderRadius: 5,
                }}
              />
            </div>
            <span style={{fontSize: 32, opacity: resultReveal}}>{resultReveal > 0.5 ? '❌' : ''}</span>
          </div>
          <div
            style={{
              opacity: resultReveal,
              textAlign: 'center',
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.accent,
              marginTop: 10,
            }}
          >
            늦게 움직인 쪽이 더 크게 잃었다
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const SimplePromiseComplexFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const promiseOpacity = interpolate(frame, [0, 20, 40], [1, 1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const knotReveal = interpolate(frame, [40, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const knotPath =
    'M 100 60 C 250 -140, 550 260, 700 -40 C 800 -220, 500 -220, 400 -40 C 320 100, 550 180, 700 100 C 850 20, 780 -140, 620 -110';
  const pathLen = 1400;

  return (
    <AbsoluteFill>
      <Caption text="약속은 단순했다, 돈의 흐름은 아니었다" />
      <Centered>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 50,
          }}
        >
          <div
            style={{
              opacity: promiseOpacity,
              fontFamily: FONT_FAMILY,
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.ink,
            }}
          >
            1달러를 지킨다
          </div>
          <svg width={800} height={280} style={{overflow: 'visible'}}>
            <path
              d={knotPath}
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - knotReveal)}
              opacity={0.85}
              transform="translate(0, 220)"
            />
          </svg>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const MayEvent: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const numReveal = spring({frame: frame - 100, fps, config: {damping: 13, stiffness: 150}, durationInFrames: 20});
  const wonReveal = spring({frame: frame - 220, fps, config: {damping: 13, stiffness: 150}, durationInFrames: 20});
  return (
    <AbsoluteFill>
      <Caption text="2022년 5월 7일" color={COLORS.accent} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <div style={{display: 'flex', gap: 40, marginBottom: 10}}>
            <span style={{fontSize: 60}}>👛</span>
            <span style={{fontSize: 60}}>👛</span>
          </div>
          <div
            style={{
              opacity: numReveal,
              transform: `scale(${0.8 + numReveal * 0.2})`,
              fontFamily: FONT_FAMILY,
              fontSize: 90,
              fontWeight: 800,
              color: COLORS.accent,
            }}
          >
            3억 7,500만 UST
          </div>
          <div
            style={{
              opacity: wonReveal,
              fontFamily: FONT_FAMILY,
              fontSize: 44,
              fontWeight: 700,
              color: COLORS.inkDim,
            }}
          >
            우리 돈으로 약 5천억 원
          </div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

const WatchedLive: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = spring({frame: frame % 40, fps, config: {damping: 100, stiffness: 60}, durationInFrames: 40});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Caption text="금액이 아니라, 모두가 실시간으로 지켜봤다는 것" color={COLORS.gold} />
      <Centered>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, opacity}}>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div
              style={{
                position: 'absolute',
                width: 130 + pulse * 40,
                height: 130 + pulse * 40,
                borderRadius: '50%',
                border: `2px solid ${COLORS.accent}`,
                opacity: 1 - pulse,
              }}
            />
            <span style={{fontSize: 90}}>👁️</span>
          </div>
          <div style={{fontFamily: FONT_FAMILY, fontSize: 34, fontWeight: 800, color: COLORS.accent}}>LIVE</div>
        </div>
      </Centered>
    </AbsoluteFill>
  );
};

export const Part14Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={B.gapStart} durationInFrames={B.raceStart - B.gapStart}>
        <TransparentVsUnderstand durationInFrames={B.raceStart - B.gapStart} />
      </Sequence>

      <Sequence from={B.raceStart} durationInFrames={B.promiseStart - B.raceStart}>
        <InfoGapRace />
      </Sequence>

      <Sequence from={B.promiseStart} durationInFrames={B.eventStart - B.promiseStart}>
        <SimplePromiseComplexFlow />
      </Sequence>

      <Sequence from={B.eventStart} durationInFrames={B.watchedStart - B.eventStart}>
        <MayEvent />
      </Sequence>

      <Sequence from={B.watchedStart} durationInFrames={B.end - B.watchedStart}>
        <WatchedLive />
      </Sequence>
    </AbsoluteFill>
  );
};
