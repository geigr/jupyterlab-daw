import { ISignal, Signal } from '@lumino/signaling';

import { getDestination, getTransport, start } from 'tone';

import { IDawExtension } from './tokens';

export class DawExtension implements IDawExtension {
  /**
   * Signal emitted when the state of the destination node (speakers)
   * is changed.
   */
  get destinationChanged(): ISignal<IDawExtension, void> {
    return this._destinationChanged;
  }

  /**
   * Proxy for the destination node (speakers) mute.
   */
  get destinationMute(): boolean {
    return getDestination().mute;
  }

  /**
   * Mute or unmute the destination node (speakers).
   */
  toggleMuteDestination(): void {
    const dest = getDestination();
    dest.mute = !dest.mute;
    this._destinationChanged.emit();
  }

  /**
   * A signal emitted whenever the state of Tonejs Transport
   * changes.
   */
  get transportChanged(): ISignal<IDawExtension, void> {
    return this._transportChanged;
  }

  /**
   * Current Tonejs transport state
   */
  get transportState(): 'started' | 'stopped' | 'paused' {
    return getTransport().state;
  }

  /**
   * Start Tone transport
   */
  transportStart(): void {
    const transport = getTransport();
    if (transport.state !== 'started') {
      // start transport inactive if context not started
      start();

      transport.start();
      this._transportChanged.emit();
    }
  }

  /**
   * Pause Tone transport
   */
  transportPause(): void {
    const transport = getTransport();
    if (transport.state === 'started') {
      transport.pause();
      this._transportChanged.emit();
    }
  }

  /**
   * Stop Tone transport
   */
  transportStop(): void {
    const transport = getTransport();
    if (transport.state !== 'stopped') {
      transport.stop();
      this._transportChanged.emit();
    }
  }

  /**
   * Boolean indicating whether the model has been disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose model ressources.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    Signal.clearData(this);
  }

  private _isDisposed = false;
  private _destinationChanged = new Signal<IDawExtension, void>(this);
  private _transportChanged = new Signal<IDawExtension, void>(this);
}
