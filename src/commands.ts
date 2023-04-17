import { JupyterFrontEnd } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';

import { DawExtension } from './model';
import { CommandIDs } from './tokens';

export function addCommands(
  app: JupyterFrontEnd,
  palette: ICommandPalette | null,
  dawModel: DawExtension
): void {
  /** Mute / Unmute main output (speakers). */
  app.commands.addCommand(CommandIDs.dawToggleDestinationMute, {
    label: 'Mute / Unmute Main Output',
    execute: () => dawModel.toggleMuteDestination()
  });

  /** Start transport. */
  app.commands.addCommand(CommandIDs.dawTransportStart, {
    label: 'Start Transport',
    execute: () => dawModel.transportStart()
  });

  /** Pause transport. */
  app.commands.addCommand(CommandIDs.dawTransportPause, {
    label: 'Pause Transport',
    execute: () => dawModel.transportPause()
  });

  /** Stop transport. */
  app.commands.addCommand(CommandIDs.dawTransportStop, {
    label: 'Stop Transport',
    execute: () => dawModel.transportStop()
  });

  if (palette !== null) {
    palette.addItem({
      command: CommandIDs.dawToggleDestinationMute,
      category: 'DAW'
    });

    palette.addItem({
      command: CommandIDs.dawTransportStart,
      category: 'DAW'
    });

    palette.addItem({
      command: CommandIDs.dawTransportPause,
      category: 'DAW'
    });

    palette.addItem({
      command: CommandIDs.dawTransportStop,
      category: 'DAW'
    });
  }
}
