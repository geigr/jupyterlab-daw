import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { TopBar } from './widgets';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd) => {
    const topBar = new TopBar();
    topBar.id = 'jp-daw-topbar';
    app.shell.add(topBar, 'top', { rank: 1000 });
  }
};

export default plugin;
