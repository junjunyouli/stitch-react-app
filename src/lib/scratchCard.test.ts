import { describe, expect, it } from 'vitest';
import { calculateScratchedPercent, REVEAL_THRESHOLD, shouldRevealFortune } from './scratchCard';

describe('scratchCard helpers', () => {
  it('calculates the scratched percentage from alpha values', () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 0,
      0, 0, 0, 255,
      0, 0, 0, 0,
      0, 0, 0, 255,
    ]);

    expect(calculateScratchedPercent(pixels)).toBe(50);
  });

  it('reveals the fortune only after the threshold is exceeded', () => {
    expect(shouldRevealFortune(REVEAL_THRESHOLD)).toBe(false);
    expect(shouldRevealFortune(REVEAL_THRESHOLD + 0.1)).toBe(true);
  });
});
