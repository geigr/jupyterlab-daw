import { Token } from '@lumino/coreutils';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';

export const EXTENSION_ID = 'jupyter.extensions.daw_plugin';

export const IDawExtension = new Token<IDawExtension>(EXTENSION_ID);

export interface IDawExtension extends IDisposable {
  /**
   * A signal emitted whenever the state of the audio destination
   * (speaker) node changes (e.g., mute, volume).
   */
  readonly destinationChanged: ISignal<IDawExtension, void>;

  /**
   * Proxy for the destination node (speakers) mute.
   */
  readonly destinationMute: boolean;

  /**
   * Mute / Unmute the audio destination.
   *
   * This is a wrapper around Tone.getDestination.mute that allows
   * emitting a signal.
   */
  toggleMuteDestination(): void;

  /**
   * A signal emitted whenever the state of Tonejs Transport
   * changes.
   */
  readonly transportChanged: ISignal<IDawExtension, void>;

  /**
   * Current Tonejs transport state
   */
  readonly transportState: 'started' | 'stopped' | 'paused';

  /**
   * Start Tone transport
   */
  transportStart(): void;

  /**
   * Pause Tone transport
   */
  transportPause(): void;

  /**
   * Stop Tone transport
   */
  transportStop(): void;
}

/**
 * The command IDs used by the daw plugin.
 */
export enum CommandIDs {
  dawToggleDestinationMute = 'daw:toggle-main-mute',
  dawTransportStart = 'daw:transport-start',
  dawTransportPause = 'daw:transport-pause',
  dawTransportStop = 'daw:transport-stop'
}
