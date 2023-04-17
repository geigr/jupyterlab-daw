import 'jest';

export const transportMock = {
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

export const drawMock = {
  schedule: jest.fn().mockImplementation((clb: { (): void }, _: any) => {
    clb();
  })
};

export function getTransport() {
  return transportMock;
}

export function getDraw() {
  return drawMock;
}
