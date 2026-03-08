export const REVEAL_THRESHOLD = 50;

export const calculateScratchedPercent = (pixels: Uint8ClampedArray) => {
  if (pixels.length === 0) return 0;

  let clearPixels = 0;

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] === 0) clearPixels += 1;
  }

  return (clearPixels / (pixels.length / 4)) * 100;
};

export const shouldRevealFortune = (scratchedPercent: number) => scratchedPercent > REVEAL_THRESHOLD;

export const DAILY_FORTUNE_SHARE_TEXT = [
  'Today’s luck: ★★★★☆',
  'Key note: Stay hydrated & be patient with yourself today.',
  'Motto: "The best way to predict the future is to create it."',
].join('\n');
