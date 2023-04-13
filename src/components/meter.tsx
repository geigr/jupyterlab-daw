import React, { useCallback, useEffect, useRef } from 'react';

import { Meter as ToneMeter, ToneAudioNode } from 'tone';

import { useAnimationFrame } from '../util/animation';

export type MeterOrientation = 'horizontal' | 'vertical';

export type MeterProps = {
  inputNode: ToneAudioNode;
  width: number;
  height: number;
  color1?: string;
  color2?: string;
  orientation?: MeterOrientation;
  fps?: number;
  thresholdValue?: number;
  enabled?: boolean;
};

/**
 * Audio meter visualizer.
 */
export const Meter: React.FC<MeterProps> = ({
  inputNode,
  width,
  height,
  color1 = 'lime',
  color2 = 'red',
  orientation = 'vertical',
  fps = 30,
  thresholdValue = 0.01,
  enabled = true
}): JSX.Element => {
  const meterRef = useRef<ToneMeter>(
    new ToneMeter({ normalRange: true, channels: 2 })
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<CanvasGradient | string>('lime');
  const extentRef = useRef<number>(width);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        let grd: CanvasGradient;
        if (orientation === 'horizontal') {
          grd = ctx.createLinearGradient(0, 0, width, 0);
        } else {
          grd = ctx.createLinearGradient(0, height, 0, 0);
        }

        grd.addColorStop(0, color1);
        grd.addColorStop(0.5, color1);
        grd.addColorStop(1, color2);

        gradientRef.current = grd;
      }
    }

    if (orientation === 'horizontal') {
      extentRef.current = width;
    } else {
      extentRef.current = height;
    }
  }, [width, height, color1, color2, orientation]);

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
    if (enabled) {
      inputNode.connect(meter);
    }

    return () => {
      if (enabled) {
        inputNode.disconnect(meter);
      }
    };
  }, [inputNode, enabled, fps]);

  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, width, height);

      const valueLR = meterRef.current.getValue() as number[];

      const thresh = thresholdValue;
      if (valueLR[0] < thresh && valueLR[1] < thresh) {
        return;
      }

      const extent = extentRef.current;
      const levelL = Math.round(Math.pow(valueLR[0], 0.2) * extent);
      const levelR = Math.round(Math.pow(valueLR[1], 0.2) * extent);

      ctx.fillStyle = gradientRef.current;

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

  useAnimationFrame(
    () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          render(context);
        }
      }
    },
    fps,
    enabled
  );

  return (
    <div>
      <canvas ref={canvasRef} height={height} width={width} />
    </div>
  );
};
