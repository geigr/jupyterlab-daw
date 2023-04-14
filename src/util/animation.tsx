import { useCallback, useEffect, useRef } from 'react';

/**
 * Reusable React Hook for setting animation frames.
 *
 * @param callback - function called at each frame (fps) render
 * @param fps {number} - allow executing the callback less often than the screen refresh rate
 * @param running {boolean=} - changing the state will either start or stop the animation
 *
 */
export const useAnimationFrame = (
  callback: { (): void },
  fps: number,
  running = true
): void => {
  const frameRef = useRef<number>(0);
  const prevRef = useRef<number>(-1);

  const animate = useCallback(() => {
    const now = performance.now();
    const delta = now - prevRef.current;
    if (prevRef.current === -1 || delta >= 1000 / fps) {
      callback();
      prevRef.current = now;
    }
    frameRef.current = requestAnimationFrame(animate);
  }, [callback, fps]);

  useEffect(() => {
    if (running) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      // delay stopping the animation (draw next 10 actual frames) so that
      // it has a chance to clear or reset properly.
      if (running) {
        setTimeout(() => {
          cancelAnimationFrame(frameRef.current);
        }, 10000 / fps);
      }
    };
  }, [running, fps, animate]);
};
