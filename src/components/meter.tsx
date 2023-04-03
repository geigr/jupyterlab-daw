import React, { useCallback, useEffect, useRef } from 'react';

import { Meter as ToneMeter, ToneAudioNode } from 'tone';

import { useAnimationFrame } from '../util/animation';

export type MeterOrientation = 'horizontal' | 'vertical';

export type MeterProps = {
  inputNode: ToneAudioNode;
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
  inputNode,
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
  const colorRef = useRef<string>('');

  useEffect(() => {
    // TODO: make color a property instead
    const root = getComputedStyle(document.documentElement);
    colorRef.current = root.getPropertyValue('--jp-brand-color1');
  });

  useEffect(() => {
    const meter = meterRef.current;

    // TODO: use smoothing with next Tone.js release version
    // https://github.com/Tonejs/Tone.js/issues/882
    meter.smoothing = 0;
    // display 2 channels even when a mono signal goes through destination
    meter.channelCountMode = 'explicit';

    return () => {
      meter.dispose();
    };
  }, []);

  useEffect(() => {
    const meter = meterRef.current;
    inputNode.connect(meter);

    return () => {
      inputNode.disconnect(meter);
    };
  }, [inputNode]);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, width, height);

      const valueLR = meterRef.current.getValue() as number[];

      const thresh = thresholdValue;
      if (valueLR[0] < thresh && valueLR[1] < thresh) {
        return;
      }

      const levelL = Math.round(Math.pow(valueLR[0], 0.5) * width);
      const levelR = Math.round(Math.pow(valueLR[1], 0.5) * width);

      ctx.fillStyle = colorRef.current;

      if (orientation === 'horizontal') {
        ctx.fillRect(0, 0, levelL, height / 2);
        ctx.fillRect(0, height / 2, levelR, height);
      } else {
        ctx.fillRect(0, height, width / 2, -levelL);
        ctx.fillRect(width / 2, height, width, -levelR);
      }
    },
    [width, height, orientation, thresholdValue]
  );

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
