import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { MeterWidget } from './components/meter';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-daw is activated!');

    const meter = new MeterWidget();
    meter.id = "jp-audioMeter";
    app.shell.add(meter, "top", { rank: 1000 });
  }
};

export default plugin;
