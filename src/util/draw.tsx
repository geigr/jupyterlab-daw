import { useEffect, useRef } from 'react';

import { getDraw, getTransport, TimeClass } from 'tone';

/**
 * React hook for Tone transport synced animations.
 */
export const useTransportDraw = (
  callback: { (): void },
  interval: string | number | TimeClass
): void => {
  const eventIDRef = useRef<number>(-1);

  useEffect(() => {
    const transport = getTransport();

    const drawCallback = (time: any) => {
      getDraw().schedule(callback, time);
    };

    eventIDRef.current = transport.scheduleRepeat(drawCallback, interval);

    return () => {
      transport.clear(eventIDRef.current);
    };
  }, [interval, callback]);
};
