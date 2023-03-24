import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useRef } from 'react';

import { Meter, getDestination } from "tone";

// units are in milliseconds
interface UseAnimationFrameCallback { (time: number, delta: number): void };

/**
 * Reusable Reacrt Hook for setting animation frames.
 *
 * Based on https://github.com/franciscop/use-animation-frame (MIT License).
 */
export const useAnimationFrame = (callback: UseAnimationFrameCallback, deps: any) => {
  const frame = useRef<number>(0);
  const last = useRef<number>(performance.now());
  const init = useRef<number>(performance.now());

  const animate = () => {
    const now = performance.now();
    const time = now - init.current;
    const delta = now - last.current;
    callback(time, delta);
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, deps); // Make sure to change it if the deps change
};


interface MeterProps {
  width: number;
  height: number;
  refreshRate: number;
}

/**
 * Stereo audio meter visualizer.
 */
const MeterComponent = (props: MeterProps): JSX.Element => {
  const meter = useRef<Meter>(new Meter({ normalRange: true }));
  const canvas = useRef<HTMLCanvasElement>(null);

  useAnimationFrame((time, delta) => {
    if (delta < 1000 / props.refreshRate) return;

    //console.log("frame rendered");
  }, []);

  useEffect(() => {
    getDestination().connect(meter.current);

    return () => {
      meter.current.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvas} height={props.height} width={props.width} />
    </div>
  );
};

MeterComponent.defaultProps = {
  width: 50,
  height: 20,
  refreshRate: 60,
}

export class MeterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-MeterWidget');
  }

  render(): JSX.Element {
    return <MeterComponent />;
  }
}
