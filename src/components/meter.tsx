import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useRef } from 'react';

import { Meter, getDestination } from 'tone';

/**
 * Reusable Reacrt Hook for setting animation frames.
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

type MeterOptions = {
  width: number;
  height: number;
  fps: number;
  thresholdValue: number;
};

/**
 * Stereo audio meter visualizer.
 */
const MeterComponent = (opts: MeterOptions): JSX.Element => {
  const meterRef = useRef<Meter>(new Meter({ normalRange: true, channels: 2 }));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const meter = meterRef.current;

    // TODO: use smoothing with next Tone.js release version
    // https://github.com/Tonejs/Tone.js/issues/882
    meter.smoothing = 0;
    // display 2 channels even when a mono signal goes through destination
    meter.channelCountMode = 'explicit';
    getDestination().connect(meter);

    return () => {
      meter.dispose();
    };
  }, []);

  const render = (ctx: CanvasRenderingContext2D) => {
    const root = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, opts.width, opts.height);

    const valueLR = meterRef.current.getValue() as number[];

    const thresh = opts.thresholdValue;
    if (valueLR[0] < thresh && valueLR[1] < thresh) {
      return;
    }

    const widthL = Math.pow(valueLR[0], 0.5) * opts.width;
    const widthR = Math.pow(valueLR[1], 0.5) * opts.width;

    const color = root.getPropertyValue('--jp-brand-color1');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, widthL, opts.height / 2);
    ctx.fillRect(0, opts.height / 2, widthR, opts.height);
  };

  useAnimationFrame(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        render(context);
      }
    }
  }, opts.fps);

  return (
    <div>
      <canvas ref={canvasRef} height={opts.height} width={opts.width} />
    </div>
  );
};

MeterComponent.defaultProps = {
  width: 60,
  height: 15,
  fps: 20,
  thresholdValue: 0.01
};

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
