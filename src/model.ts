import { ISignal, Signal } from '@lumino/signaling';

import { getDestination, getTransport, start } from 'tone';

import { IDawExtension } from './tokens';

export class DawExtension implements IDawExtension {
  constructor() {
    const transport = getTransport();

    this._transportClb = () => {
      this._transportChanged.emit();
    };
    transport.on('start', this._transportClb);
    transport.on('pause', this._transportClb);
    transport.on('stop', this._transportClb);
  }

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
   * Dispose model ressources and unbind tone signal callbacks.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }

    Signal.clearData(this);

    const transport = getTransport();
    transport.off('start', this._transportClb);
    transport.off('pause', this._transportClb);
    transport.off('stop', this._transportClb);

    this._isDisposed = true;
  }

  private _transportClb: { (): void };
  private _isDisposed = false;
  private _destinationChanged = new Signal<IDawExtension, void>(this);
  private _transportChanged = new Signal<IDawExtension, void>(this);
}
