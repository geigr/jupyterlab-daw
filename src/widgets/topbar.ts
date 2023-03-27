import { Toolbar } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { Meter } from './meter';

const TOPBAR_CLASS = 'jp-daw-TopBar';
const CONTENT_CLASS = 'jp-daw-TopBar-item';

export class TopBar extends Toolbar<Widget> {
  constructor() {
    super();
    this.addClass(TOPBAR_CLASS);

    const meter = new Meter({
      width: 60,
      height: 23,
      fps: 20,
      orientation: 'horizontal'
    });
    this.addItem('jp-daw-topbar-meter', meter);
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }
}
