import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { Meter } from './widgets';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd) => {
    const meter = new Meter({ width: 60, height: 15, fps: 20, orientation: 'horizontal' });
    meter.id = 'jp-daw-topbar-meter';
    app.shell.add(meter, 'top', { rank: 1000 });
  }
};

export default plugin;
