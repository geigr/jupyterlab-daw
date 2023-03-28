import { Toolbar, ToolbarButton } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { getDestination } from 'tone';

import { Meter } from './meter';
import { speakerIcon, muteIcon } from '../iconimports';

const TOPBAR_CLASS = 'jp-daw-TopBar';
const CONTENT_CLASS = 'jp-daw-TopBar-item';

export class TopBar extends Toolbar<Widget> {
  constructor() {
    super();
    this.addClass(TOPBAR_CLASS);

    const meter = new Meter({
      inputNode: getDestination(),
      width: 60,
      height: 23,
      fps: 20,
      orientation: 'horizontal'
    });
    this.addItem('jp-daw-topbar-meter', meter);

    const toggleMute = new ToolbarButton({
      icon: speakerIcon,
      pressedIcon: muteIcon,
      onClick: () => {
      },
      tooltip: 'mute',
      pressedTooltip: 'unmute'
    });
    this.addItem('toggle-mute', toggleMute)
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }
}
