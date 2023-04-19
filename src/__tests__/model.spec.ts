import { testEmission } from '@jupyterlab/testutils';
import 'jest';
import { getDestination, getTransport, start } from 'tone';

import { IDawExtension } from '../tokens';
import { DawExtension } from '../model';

describe('DawExtension', () => {
  let model: IDawExtension;

  beforeEach(async () => {
    model = new DawExtension();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('destination', () => {
    it('should emit a destinationChanged signal on toggle mute', async () => {
      const testSignal = testEmission(model.destinationChanged, {
        test: (_, args) => {
          expect(args).toBeUndefined();
        }
      });

      expect(model.destinationMute).toBe(false);
      model.toggleMuteDestination();
      await testSignal;
      expect(model.destinationMute).toBe(true);
      expect(model.destinationMute).toEqual(getDestination().mute);
    });
  });

  describe('transport state', () => {
    it('should correspond to tonejs state', () => {
      Object.assign(getTransport(), { state: 'stopped' });
      expect(model.transportState).toEqual('stopped');

      Object.assign(getTransport(), { state: 'started' });
      expect(model.transportState).toEqual('started');
    });

    it.each([
      [
        'started',
        'stopped',
        () => model.transportStart(),
        getTransport().start
      ],
      ['paused', 'started', () => model.transportPause(), getTransport().pause],
      ['stopped', 'started', () => model.transportStop(), getTransport().stop]
    ])(
      'should emit a transportChanged signal when actually %p',
      async (
        testState: string,
        initState: string,
        modelFunc: { (): void },
        toneFunc: { (): void }
      ) => {
        const testSignal = testEmission(model.transportChanged, {
          test: (_, args) => {
            expect(args).toBeUndefined();
          }
        });

        // ensure mocked transport is set in the given initial state
        Object.assign(getTransport(), { state: initState });

        modelFunc();
        await testSignal;
        if (testState === 'started') {
          expect(start).toBeCalled();
        }
        expect(toneFunc).toBeCalled();
      }
    );

    it.each([
      [
        'started',
        'started',
        () => model.transportStart(),
        getTransport().start
      ],
      ['paused', 'stopped', () => model.transportPause(), getTransport().pause],
      ['stopped', 'stopped', () => model.transportStop(), getTransport().stop]
    ])(
      'should not change state to %p (and emit signal) when not needed',
      async (
        _: string,
        initState: string,
        modelFunc: { (): void },
        toneFunc: { (): void }
      ) => {
        // ensure mocked transport is set in the given initial state
        Object.assign(getTransport(), { state: initState });

        modelFunc();
        expect(toneFunc).not.toBeCalled();
      }
    );

    it('should listen to Tonejs transport events', () => {
      expect(getTransport().on).toBeCalledWith('start', expect.anything());
      expect(getTransport().on).toBeCalledWith('pause', expect.anything());
      expect(getTransport().on).toBeCalledWith('stop', expect.anything());
    });

    it('should stop listening to Tonejs transport events when disposed', () => {
      model.dispose();
      expect(getTransport().off).toBeCalledWith('start', expect.anything());
      expect(getTransport().off).toBeCalledWith('pause', expect.anything());
      expect(getTransport().off).toBeCalledWith('stop', expect.anything());
    });
  });
});
