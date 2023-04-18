import React, { useCallback, useEffect, useState } from 'react';

import { getTransport } from 'tone';

import { useTransportDraw } from '../util/draw';

export type TransportPositionProps = {
  state?: 'started' | 'stopped' | 'paused';
  dirtyClassName?: string;
};

function getTransportPosition(): string {
  const pos = getTransport().position.toString();
  return pos.substr(0, pos.lastIndexOf(':')) + ':0';
}

export const TransportPosition: React.FC<TransportPositionProps> = ({
  state = 'stopped',
  dirtyClassName = ''
}): JSX.Element => {
  const [position, setPosition] = useState<string>(getTransportPosition());
  const [dirty, setDirty] = useState<boolean>(false);

  // make sure to reset the input value when transport is stopped
  // reset dirty when transport is started or stopped
  useEffect(() => {
    if (state === 'stopped') {
      setPosition(getTransportPosition());
      setDirty(false);
    } else if (state === 'started') {
      setDirty(false);
    }
  }, [state]);

  const setPositionClb = useCallback(() => {
    setPosition(getTransportPosition());
  }, []);

  useTransportDraw(setPositionClb, '4n');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPosition(value);
    setDirty(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getTransport().position = position;
      // update input value with reformatted position
      setPosition(getTransportPosition());
      setDirty(false);
    }
  };

  return (
    <input
      type="text"
      className={dirty ? dirtyClassName : ''}
      disabled={state === 'started'}
      value={position}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};
