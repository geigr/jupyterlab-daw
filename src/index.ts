import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-daw extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-daw:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-daw is activated!');
  }
};

export default plugin;
