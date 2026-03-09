import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: vi.fn(() => ({
    createLinearGradient: () => ({
      addColorStop: vi.fn(),
    }),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(16),
    })),
    globalCompositeOperation: 'source-over',
    fillStyle: '',
    font: '',
    textAlign: 'center',
    lineCap: 'butt',
    lineJoin: 'miter',
    lineWidth: 1,
  })),
});
