import React, { useEffect, useRef } from 'react';

import { Meter as ToneMeter, getDestination } from 'tone';

import { useAnimationFrame } from '../util/animation';

export type MeterOrientation = 'horizontal' | 'vertical';

export type MeterProps = {
  width: number;
  height: number;
  orientation?: MeterOrientation;
  fps?: number;
  thresholdValue?: number;
};

/**
 * Audio meter visualizer.
 */
export const Meter: React.FC<MeterProps> = ({
  width,
  height,
  orientation = 'vertical',
  fps = 30,
  thresholdValue = 0.01
}): JSX.Element => {
  const meterRef = useRef<ToneMeter>(
    new ToneMeter({ normalRange: true, channels: 2 })
  );
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
    ctx.clearRect(0, 0, width, height);

    const valueLR = meterRef.current.getValue() as number[];

    const thresh = thresholdValue;
    if (valueLR[0] < thresh && valueLR[1] < thresh) {
      return;
    }

    const levelL = Math.pow(valueLR[0], 0.5) * width;
    const levelR = Math.pow(valueLR[1], 0.5) * width;

    const color = root.getPropertyValue('--jp-brand-color1');
    ctx.fillStyle = color;

    if (orientation === 'horizontal') {
      ctx.fillRect(0, 0, levelL, height / 2);
      ctx.fillRect(0, height / 2, levelR, height);
    } else {
      ctx.fillRect(0, height, width / 2, -levelL);
      ctx.fillRect(width / 2, height, width, -levelR);
    }
  };

  useAnimationFrame(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        render(context);
      }
    }
  }, fps);

  return (
    <div>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  );
};
