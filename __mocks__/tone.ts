import 'jest';

export const start = jest.fn();

export class Time {
  constructor(value: number) {
    this._value = value;
  }
  toString(): string {
    return this._value.toString();
  }
  _value: number;
}

export class ToneAudioNode {
  connect = jest.fn();
  disconnect = jest.fn();
  dispose = jest.fn();
}

export class Gain extends ToneAudioNode {}

export class Meter extends ToneAudioNode {
  getValue = jest.fn(() => 1.0);
}

export const Destination = {
  mute: false
};

export function getDestination() {
  return Destination;
}

class TransportClass {
  state = 'stopped';
  start = jest.fn();
  pause = jest.fn();
  stop = jest.fn();
  get position(): Time {
    return new Time(0);
  }
  set position(_: Time) {}
  scheduleRepeat = jest
    .fn()
    .mockImplementation(
      (clb: { (time: number): void; interval: any }): number => {
        clb(0);
        return 0;
      }
    );
  clear = jest.fn();
  // Emitter implementation
  on = jest.fn();
  off = jest.fn();
}

export const Transport = new TransportClass();

export function getTransport() {
  return Transport;
}

export const Draw = {
  schedule: jest.fn().mockImplementation((clb: { (): void }, _: any) => {
    clb();
  })
};

export function getDraw() {
  return Draw;
}
