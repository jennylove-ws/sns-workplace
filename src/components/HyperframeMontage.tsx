import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';

export type HyperframeItem =
  | {type: 'image'; src: string}
  | {type: 'node'; node: React.ReactNode};

/**
 * "하이퍼프레임" 스타일: 여러 장면을 아주 짧게(프레임 단위) 빠르게 전환하며
 * 살짝 확대되는 펀치와 크로스페이드를 겹쳐 스트로브 느낌을 낸다.
 * 마지막 아이템에서 살짝 느려지며 멈추는 게 기본값(강조하고 싶은 장면을 마지막에 둘 것).
 */
export const HyperframeMontage: React.FC<{
  items: HyperframeItem[];
  holdFrames?: number; // 기본 프레임당 유지 시간
  finalHoldFrames?: number; // 마지막 아이템 유지 시간(강조)
  crossfadeFrames?: number;
  punchScale?: number;
}> = ({
  items,
  holdFrames = 6,
  finalHoldFrames = 24,
  crossfadeFrames = 3,
  punchScale = 0.12,
}) => {
  const frame = useCurrentFrame();

  let cursor = 0;
  const ranges = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const len = isLast ? finalHoldFrames : holdFrames;
    const start = cursor;
    const end = start + len;
    cursor = end;
    return {item, start, end};
  });

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {ranges.map(({item, start, end}, i) => {
        if (frame < start - crossfadeFrames || frame > end + crossfadeFrames) {
          return null;
        }
        const opacity = interpolate(
          frame,
          [start - crossfadeFrames, start, end - crossfadeFrames, end],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        );
        const localT = interpolate(frame, [start, end], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = 1 + punchScale * (1 - localT);

        return (
          <AbsoluteFill
            key={i}
            style={{
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {item.type === 'image' ? (
              <Img
                src={item.src}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              item.node
            )}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const hyperframeDuration = (
  items: HyperframeItem[],
  holdFrames = 6,
  finalHoldFrames = 24
) => holdFrames * (items.length - 1) + finalHoldFrames;
