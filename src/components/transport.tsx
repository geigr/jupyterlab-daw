import React, { useCallback, useState } from 'react';

import { getTransport } from 'tone';

import { useTransportDraw } from '../util/draw';

export type TransportPositionProps = {
  editable?: boolean;
};

export const TransportPosition: React.FC<TransportPositionProps> = ({
  editable = false
}): JSX.Element => {
  const [position, setPosition] = useState<string>('0:0:0');

  const setPositionClb = useCallback(() => {
    let pos = getTransport().position.toString();
    pos = pos.substr(0, pos.lastIndexOf(':')) + ':0';
    if (pos !== position) {
      setPosition(pos);
    }
  }, []);

  useTransportDraw(setPositionClb, '4n');

  return <div contentEditable={editable}>{position}</div>;
};
