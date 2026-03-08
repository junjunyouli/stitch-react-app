import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the page heading and default guidance', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /daily fortune/i })).toBeInTheDocument();
    expect(screen.getByText(/scratch to reveal your destiny/i)).toBeInTheDocument();
    expect(screen.getByText(/use your finger to scratch the gold area/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share my fortune/i })).toBeInTheDocument();
  });

  it('uses the native share api when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
    });

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /share my fortune/i }));

    await waitFor(() => {
      expect(share).toHaveBeenCalled();
    });

    expect(screen.getByRole('status')).toHaveTextContent(/shared successfully/i);
  });

  it('falls back to clipboard when share api is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /share my fortune/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });

    expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
  });
});
