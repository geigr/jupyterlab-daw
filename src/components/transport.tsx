import React, { useCallback, useEffect, useState } from 'react';

import { getTransport } from 'tone';

import { useTransportDraw } from '../util/draw';

export type TransportPositionProps = {
  editable?: boolean;
};

function getTransportPosition(): string {
  const pos = getTransport().position.toString();
  return pos.substr(0, pos.lastIndexOf(':')) + ':0';
}

export const TransportPosition: React.FC<TransportPositionProps> = ({
  editable = false
}): JSX.Element => {
  const [position, setPosition] = useState<string>(getTransportPosition());

  // force updating position when the component is re-rendered
  useEffect(() => {
    setPosition(getTransportPosition());
  }, [editable]);

  const setPositionClb = useCallback(() => {
    const pos = getTransportPosition();
    if (pos !== position) {
      setPosition(pos);
    }
  }, []);

  useTransportDraw(setPositionClb, '4n');

  return <div contentEditable={editable}>{position}</div>;
};
