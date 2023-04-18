import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';

import { getTransport } from 'tone';

import { TransportPosition } from '..';

describe('TransportPosition', () => {
  let spyPositionGetter: jest.SpyInstance;
  let spyPositionSetter: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    spyPositionGetter = jest
      .spyOn(getTransport(), 'position', 'get')
      .mockReturnValue('0:0:0');
    spyPositionSetter = jest.spyOn(getTransport(), 'position', 'set');
  });

  it('shows transport position as input value', () => {
    render(<TransportPosition />);
    const input = screen.getByDisplayValue('0:0:0');
    expect(input).toBeInTheDocument();
  });

  it('has input disabled if transport is started', () => {
    const { container } = render(<TransportPosition state={'started'} />);
    const input = container.firstChild;
    expect(input).toHaveAttribute('disabled');
  });

  it('updates input value with position when transport is started', () => {
    const { rerender } = render(<TransportPosition />);

    // clear and rerender to explicitly skip the call to
    // getTransport().position within the useEffect(..., [disabled])
    spyPositionGetter.mockClear();
    rerender(<TransportPosition />);

    // The useTransportDraw mock calls the callback directly
    expect(spyPositionGetter).toBeCalledTimes(1);
  });

  it('resets the input value when transport is stopped', () => {
    const { container, rerender } = render(
      <TransportPosition state="paused" />
    );
    const input = container.firstChild as HTMLInputElement;

    fireEvent.change(input, { target: { value: '1:0:0' } });
    rerender(<TransportPosition state={'stopped'} />);

    // input value reset to mocked transport position
    expect(input.value).toBe('0:0:0');
  });

  it('updates transport position on keyboard actions (Enter)', async () => {
    const { container } = render(<TransportPosition />);
    const input = container.firstChild as HTMLInputElement;

    fireEvent.change(input, { target: { value: '1:0:0' } });
    expect(input.value).toBe('1:0:0');

    spyPositionGetter.mockClear();

    await userEvent.type(input, '{enter}');
    expect(spyPositionSetter).toBeCalledWith('1:0:0');
    // position is read to show the reformatted value
    expect(spyPositionGetter).toBeCalled();
  });

  it('sets dirty class depending on editing', async () => {
    const { container, rerender } = render(
      <TransportPosition dirtyClassName="dirty" />
    );
    const input = container.firstChild as HTMLInputElement;

    expect(input.className).toBe('');

    // edit position then press Enter
    await userEvent.type(input, '0');
    expect(input.className).toBe('dirty');

    await userEvent.type(input, '{enter}');
    expect(input.className).toBe('');

    // edit position then change start transport
    await userEvent.type(input, '0');
    expect(input.className).toBe('dirty');

    rerender(<TransportPosition dirtyClassName="dirty" state="started" />);
    expect(input.className).toBe('');

    // pause, edit and then stop transport
    rerender(<TransportPosition dirtyClassName="dirty" state="paused" />);
    await userEvent.type(input, '0');
    rerender(<TransportPosition dirtyClassName="dirty" state="stopped" />);
    expect(input.className).toBe('');
  });
});
