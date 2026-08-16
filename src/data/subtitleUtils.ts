import {SubtitleLine} from '../components/Subtitle';

/**
 * Rough auto-timing for scaffolding/preview only. Splits `durationInFrames`
 * across `texts` proportionally to character count. Once real narration
 * audio (with a timestamped transcript or SRT) is available, replace this
 * with the actual timings instead of estimating from text length.
 */
export const layoutSubtitles = (
  texts: string[],
  durationInFrames: number,
  gapFrames = 4
): SubtitleLine[] => {
  const weights = texts.map((t) => Math.max(t.length, 8));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const totalGap = gapFrames * (texts.length - 1);
  const usable = durationInFrames - totalGap;

  let cursor = 0;
  return texts.map((text, i) => {
    const len = Math.round((weights[i] / totalWeight) * usable);
    const startFrame = cursor;
    const endFrame = startFrame + len;
    cursor = endFrame + gapFrames;
    return {text, startFrame, endFrame};
  });
};
