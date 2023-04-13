import React, { useCallback, useEffect, useState } from 'react';

import { getTransport } from 'tone';

import { useTransportDraw } from '../util/draw';

export type TransportPositionProps = {
  disabled?: boolean;
};

function getTransportPosition(): string {
  const pos = getTransport().position.toString();
  return pos.substr(0, pos.lastIndexOf(':')) + ':0';
}

export const TransportPosition: React.FC<TransportPositionProps> = ({
  disabled = false
}): JSX.Element => {
  const [position, setPosition] = useState<string>(getTransportPosition());

  // update position input value when transport is stopped
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (getTransport().state === 'stopped') {
      setPosition(getTransportPosition());
    }
  });

  const setPositionClb = useCallback(() => {
    setPosition(getTransportPosition());
  }, []);

  useTransportDraw(setPositionClb, '4n');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      getTransport().position = position;
    }
  };

  return (
    <input
      type="text"
      disabled={disabled}
      value={position}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};
