import 'jest';
import { renderHook } from '@testing-library/react-hooks';
import { getTransport } from 'tone';

import { useTransportDraw } from '../draw';

describe('useTransportDraw', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should schedule draw and transport callbacks', () => {
    const clb = jest.fn();
    const result = renderHook(() => useTransportDraw(clb, '4n'));

    expect(clb).toHaveBeenCalled();
    expect(getTransport().scheduleRepeat).toHaveBeenCalledWith(
      expect.anything(),
      '4n'
    );

    result.unmount();

    expect(getTransport().clear).toHaveBeenCalled();
  });
});
