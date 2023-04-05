import { JupyterFrontEnd } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';

import { DawExtension } from './model';
import { CommandIDs } from './tokens';

export function addCommands(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  dawModel: DawExtension
): void {
  /** Mute / Unmute main output (speakers). */
  app.commands.addCommand(CommandIDs.dawToggleDestinationMute, {
    label: 'Mute / Unmute Main Output',
    execute: () => dawModel.toggleMuteDestination()
  });

  palette.addItem({
    command: CommandIDs.dawToggleDestinationMute,
    category: 'DAW'
  });

  /** Start transport. */
  app.commands.addCommand(CommandIDs.dawTransportStart, {
    label: 'Start Transport',
    execute: () => dawModel.transportStart()
  });

  palette.addItem({
    command: CommandIDs.dawTransportStart,
    category: 'DAW'
  });

  /** Pause transport. */
  app.commands.addCommand(CommandIDs.dawTransportPause, {
    label: 'Pause Transport',
    execute: () => dawModel.transportPause()
  });

  palette.addItem({
    command: CommandIDs.dawTransportPause,
    category: 'DAW'
  });

  /** Stop transport. */
  app.commands.addCommand(CommandIDs.dawTransportStop, {
    label: 'Stop Transport',
    execute: () => dawModel.transportStop()
  });

  palette.addItem({
    command: CommandIDs.dawTransportStop,
    category: 'DAW'
  });
}
