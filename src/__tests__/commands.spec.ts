import { JupyterFrontEnd } from '@jupyterlab/application';
import { CommandRegistry } from '@lumino/commands';
import 'jest';

import { addCommands } from '../commands';
import { DawExtension } from '../model';
import { CommandIDs } from '../tokens';

describe('daw-commands', () => {
  let commands: CommandRegistry;
  let model: DawExtension;

  beforeEach(async () => {
    commands = new CommandRegistry();
    const app = {
      commands,
      shell: null as any
    };

    model = new DawExtension();

    addCommands(app as JupyterFrontEnd, null, model);
  });

  describe('daw:toggle-main-mute', () => {
    it('should toggle mute destination', async () => {
      const spyToggleMuteDestination = jest.spyOn(
        model,
        'toggleMuteDestination'
      );
      await commands.execute(CommandIDs.dawToggleDestinationMute);
      expect(spyToggleMuteDestination).toBeCalled();
    });
  });

  describe('daw:transport-start', () => {
    it('should start transport', async () => {
      const spyTransportStart = jest.spyOn(model, 'transportStart');
      await commands.execute(CommandIDs.dawTransportStart);
      expect(spyTransportStart).toBeCalled();
    });
  });

  describe('daw:transport-pause', () => {
    it('should pause transport', async () => {
      const spyTransportPause = jest.spyOn(model, 'transportPause');
      await commands.execute(CommandIDs.dawTransportPause);
      expect(spyTransportPause).toBeCalled();
    });
  });

  describe('daw:transport-stop', () => {
    it('should stop transport', async () => {
      const spyTransportStop = jest.spyOn(model, 'transportStop');
      await commands.execute(CommandIDs.dawTransportStop);
      expect(spyTransportStop).toBeCalled();
    });
  });
});
