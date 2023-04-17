import 'jest';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAnimationFrame } from '../animation';

describe('useAnimationFrame', () => {
  let rafSpied: jest.SpyInstance;
  let cafSpied: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers('modern');

    // set a fake refresh rate of 40 Hz, which corresponds to a finite interval
    // of 25 ms so that it makes timing events more predictable
    const refreshInterval = 1000 / 40;

    rafSpied = jest.spyOn(window, 'requestAnimationFrame');
    rafSpied.mockImplementation((clb: FrameRequestCallback): number => {
      return window.setTimeout(() => clb(performance.now()), refreshInterval);
    });

    cafSpied = jest.spyOn(window, 'cancelAnimationFrame');
    cafSpied.mockImplementation((id: number): void => {
      return window.clearTimeout(id);
    });
  });

  afterAll(() => {
    jest.useRealTimers();
    rafSpied.mockRestore();
    cafSpied.mockRestore();
  });

  it('should not execute the callback when running is false', () => {
    const clb = jest.fn();
    renderHook(() => useAnimationFrame(clb, 60, false));

    expect(clb).not.toHaveBeenCalled();
  });

  it('should execute the callback at the frequency given by fps', () => {
    const clb = jest.fn();
    const fps = 20;

    renderHook(() => useAnimationFrame(clb, fps, true));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(clb).toBeCalledTimes(fps);
  });

  it('should cancel the animation with a delay after unmount', () => {
    const clb = jest.fn();
    const fps = 20;
    const result = renderHook(() => useAnimationFrame(clb, fps, true));

    act(() => {
      result.unmount();
      jest.advanceTimersByTime(10000 / fps);
    });

    expect(cafSpied).toBeCalled();
  });
});
