import 'jest';

export const start = jest.fn();

export const Destination = {
  mute: false
};

export function getDestination() {
  return Destination;
}

export const Transport = {
  state: 'stopped',
  start: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  scheduleRepeat: jest
    .fn()
    .mockImplementation(
      (clb: { (time: number): void; interval: any }): number => {
        clb(0);
        return 0;
      }
    ),
  clear: jest.fn()
};

Object.defineProperty(Transport, 'position', {
  get: jest.fn(() => '0:0:0'),
  set: jest.fn()
});

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
