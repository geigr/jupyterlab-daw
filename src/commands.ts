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
}
