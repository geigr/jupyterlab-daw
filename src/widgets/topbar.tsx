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

import { Meter } from '../components/meter';
import { TransportPosition } from '../components/transport';
import {
  speakerIcon,
  muteIcon,
  playIcon,
  stopIcon,
  pauseIcon
} from '../iconimports';
import { CommandIDs, IDawExtension } from '../tokens';

const TOPBAR_CLASS = 'jp-daw-TopBar';
const CONTENT_CLASS = 'jp-daw-TopBar-item';

export class TopBar extends Toolbar<Widget> {
  constructor(model: IDawExtension, commands: CommandRegistry) {
    super();
    this._model = model;
    this.addClass(TOPBAR_CLASS);

    const playButton = ReactWidget.create(
      <UseSignal signal={model.transportChanged}>
        {() => (
          <ToolbarButtonComponent
            icon={playIcon}
            pressedIcon={pauseIcon}
            pressed={model.transportState === 'started'}
            tooltip={'start transport'}
            pressedTooltip={'pause transport'}
            onClick={() => {
              if (model.transportState === 'started') {
                commands.execute(CommandIDs.dawTransportPause);
              } else {
                commands.execute(CommandIDs.dawTransportStart);
              }
            }}
          />
        )}
      </UseSignal>
    );

    this.addItem('jp-daw-topbar-play', playButton);

    const stopButton = ReactWidget.create(
      <UseSignal signal={model.transportChanged}>
        {() => (
          <ToolbarButtonComponent
            icon={stopIcon}
            tooltip={'stop transport'}
            onClick={() => {
              commands.execute(CommandIDs.dawTransportStop);
            }}
          />
        )}
      </UseSignal>
    );

    this.addItem('jp-daw-topbar-stop', stopButton);

    const transportPosition = ReactWidget.create(
      <UseSignal signal={model.transportChanged}>
        {() => (
          <TransportPosition
            state={model.transportState}
            dirtyClassName={'jp-daw-mod-dirty'}
          />
        )}
      </UseSignal>
    );

    transportPosition.addClass('jp-daw-TransportPosition');
    this.addItem('jp-daw-topbar-transport-position', transportPosition);

    const meter = ReactWidget.create(
      <UseSignal signal={model.destinationChanged}>
        {() => (
          <Meter
            inputNode={getDestination()}
            width={16}
            height={21}
            fps={20}
            orientation={'vertical'}
            enabled={!this._model.destinationMute}
          />
        )}
      </UseSignal>
    );

    meter.addClass('jp-daw-Meter');
    this.addItem('jp-daw-topbar-meter', meter);

    const toggleMuteButton = ReactWidget.create(
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

    this.addItem('jp-daw-topbar-toggle-mute', toggleMuteButton);
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }

  private _model: IDawExtension;
}
