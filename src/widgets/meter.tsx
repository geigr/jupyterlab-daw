import React from 'react';

import { ReactWidget } from '@jupyterlab/apputils';

import { Meter as RMeter, MeterOrientation } from '../components';

export class Meter extends ReactWidget {
  /**
   * Constructs a new Meter.
   */
  constructor(options: Meter.IOptions) {
    super();
    this.addClass('jp-daw-Meter');
    this.width = options.width;
    this.height = options.height;
    this.orientation = options.orientation || 'vertical';
    this.fps = options.fps || 30;
    this.thresholdValue = options.thresholdValue || 0.01;
  }

  readonly width: number;
  readonly height: number;
  readonly orientation: MeterOrientation;
  readonly fps: number;
  readonly thresholdValue: number;

  render(): JSX.Element {
    return (
      <RMeter
        width={this.width}
        height={this.height}
        orientation={this.orientation}
        fps={this.fps}
        thresholdValue={this.thresholdValue}
      />
    );
  }
}

export namespace Meter {
  export interface IOptions {
    width: number;
    height: number;
    orientation?: MeterOrientation;
    fps?: number;
    thresholdValue?: number;
  }
}
