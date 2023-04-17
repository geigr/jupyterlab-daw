import { render } from '@testing-library/react';
import { setupJestCanvasMock } from 'jest-canvas-mock';
import React from 'react';
import { Gain } from 'tone';

import { Meter } from '..';

describe('Meter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();
  });

  it('connects inputNode to Meter node when enabled', () => {
    const gain = new Gain();
    const { unmount } = render(
      <Meter inputNode={gain} height={20} width={10} enabled={true} />
    );
    expect(gain.connect).toBeCalled();

    unmount();

    expect(gain.disconnect).toBeCalled();
  });

  it('does not connect inputNode to Meter node when not enabled', () => {
    const gain = new Gain();
    const { unmount } = render(
      <Meter inputNode={gain} height={20} width={10} enabled={false} />
    );
    expect(gain.connect).not.toBeCalled();

    unmount();

    expect(gain.disconnect).not.toBeCalled();
  });

  it('rendered canvas matches snapshot', () => {
    const gain = new Gain();
    const { container } = render(
      <Meter inputNode={gain} height={20} width={10} enabled={true} />
    );

    const canvas = container.getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');
    const events = (ctx as any).__getEvents();
    expect(events).toMatchSnapshot();
  });
});
