import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { TopBar } from './widgets';

import { DawExtension } from './model';
import { IDawExtension } from './tokens';

export { IDawExtension } from './tokens';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<IDawExtension> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  requires: [],
  provides: IDawExtension,
  activate: (app: JupyterFrontEnd): IDawExtension => {
    const dawExtension = new DawExtension();

    const topBar = new TopBar(dawExtension);
    topBar.id = 'jp-daw-topbar';
    app.shell.add(topBar, 'top', { rank: 1000 });

    return dawExtension;
  }
};

export default plugin;
