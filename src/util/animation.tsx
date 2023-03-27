import { useEffect, useRef } from 'react';

/**
 * Reusable React Hook for setting animation frames.
 *
 * Based on https://github.com/franciscop/use-animation-frame (MIT License).
 */
export const useAnimationFrame = (
  callback: { (): void },
  fps: number
): void => {
  const frameRef = useRef<number>(0);
  const prevRef = useRef<number>(-1);

  const animate = () => {
    const now = performance.now();
    const delta = now - prevRef.current;
    if (prevRef.current === -1 || delta > 1000 / fps) {
      callback();
      prevRef.current = now;
    }
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  });
};
