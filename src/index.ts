import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';

import { TopBar } from './widgets';

import { addCommands } from './commands';
import { DawExtension } from './model';
import { IDawExtension } from './tokens';

export { IDawExtension } from './tokens';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<IDawExtension> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  optional: [ICommandPalette],
  provides: IDawExtension,
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette | null
  ): IDawExtension => {
    const dawExtension = new DawExtension();

    addCommands(app, palette, dawExtension);

    const topBar = new TopBar(dawExtension, app.commands);
    topBar.id = 'jp-daw-topbar';
    app.shell.add(topBar, 'top', { rank: 1000 });

    return dawExtension;
  }
};

export default plugin;
