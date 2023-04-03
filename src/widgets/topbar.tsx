import {
  ReactWidget,
  Toolbar,
  ToolbarButtonComponent,
  UseSignal
} from '@jupyterlab/apputils';

import { CommandRegistry } from '@lumino/commands';
import { Widget } from '@lumino/widgets';

import React from 'react';

import { getDestination } from 'tone';

import { Meter } from './meter';
import { speakerIcon, muteIcon } from '../iconimports';
import { CommandIDs, IDawExtension } from '../tokens';

const TOPBAR_CLASS = 'jp-daw-TopBar';
const CONTENT_CLASS = 'jp-daw-TopBar-item';

export class TopBar extends Toolbar<Widget> {
  constructor(model: IDawExtension, commands: CommandRegistry) {
    super();
    this._model = model;
    this.addClass(TOPBAR_CLASS);

    const meter = new Meter({
      inputNode: getDestination(),
      width: 60,
      height: 23,
      fps: 20,
      orientation: 'horizontal'
    });
    this.addItem('jp-daw-topbar-meter', meter);

    const toggleMute = ReactWidget.create(
      <UseSignal signal={model.destinationChanged}>
        {() => (
          <ToolbarButtonComponent
            icon={speakerIcon}
            pressedIcon={muteIcon}
            pressed={this._model.destinationMute}
            tooltip={'mute'}
            pressedTooltip={'unmute'}
            onClick={() => {
              commands.execute(CommandIDs.dawToggleDestinationMute);
            }}
          />
        )}
      </UseSignal>
    );
    this.addItem('jp-daw-topbar-toggle-mute', toggleMute);
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }

  private _model: IDawExtension;
}
