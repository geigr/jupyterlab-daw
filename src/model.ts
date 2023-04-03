import { ISignal, Signal } from '@lumino/signaling';

import { getDestination } from 'tone';

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
}
