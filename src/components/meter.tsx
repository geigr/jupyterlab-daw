import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useRef } from 'react';

import { Meter, getDestination } from "tone";

// units are in milliseconds
interface UseAnimationFrameCallback { (delta: number): void };

/**
 * Reusable Reacrt Hook for setting animation frames.
 *
 * Based on https://github.com/franciscop/use-animation-frame (MIT License).
 */
export const useAnimationFrame = (callback: UseAnimationFrameCallback, fps: number, deps: any) => {
  const frame = useRef<number>(0);
  const prev = useRef<number>(-1);

  const animate = () => {
    const now = performance.now();
    const delta = now - prev.current;
    if (prev.current == -1 || delta > 1000 / fps) {
      callback(delta);
      prev.current = now;
    }
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, deps);
};

interface MeterProps {
  width: number;
  height: number;
  fps: number;
  thresholdValue: number;
}

/**
 * Stereo audio meter visualizer.
 */
const MeterComponent = (props: MeterProps): JSX.Element => {
  const meter = useRef<Meter>(new Meter({ normalRange: true, channels: 2, smoothing: 0 }));
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // TODO: use smoothing with next Tone.js release version
    // https://github.com/Tonejs/Tone.js/issues/882
    meter.current.smoothing = 0;
    // display 2 channels even when a mono signal goes through destination
    meter.current.channelCountMode = "explicit";
    getDestination().connect(meter.current);

    return () => {
      meter.current.dispose();
    };
  }, []);

  const render = (ctx: CanvasRenderingContext2D) => {
    const root = getComputedStyle(document.documentElement);
    ctx.clearRect(0, 0, props.width, props.height);

    const valueLR = meter.current.getValue() as number[];

    const thresh = props.thresholdValue;
    if (valueLR[0] < thresh && valueLR[1] < thresh) return;

    const widthL = Math.pow(valueLR[0], 0.5) * props.width;
    const widthR = Math.pow(valueLR[1], 0.5) * props.width;

    const color = root.getPropertyValue('--jp-brand-color1');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, widthL, props.height / 2);
    ctx.fillRect(0, props.height / 2, widthR, props.height);
  }

  useAnimationFrame(() => {
    if (canvas.current) {
	    const context = canvas.current.getContext('2d');
      if (context) {
        render(context);
      }
    }
  }, props.fps, []);

  return (
    <div>
      <canvas ref={canvas} height={props.height} width={props.width} />
    </div>
  );
};

MeterComponent.defaultProps = {
  width: 60,
  height: 15,
  fps: 20,
  thresholdValue: 0.01,
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
