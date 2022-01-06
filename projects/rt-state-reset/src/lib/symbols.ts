import {InjectionToken} from '@angular/core';


/** Available configs for `RtStateResetConfig` module. */
export interface RtStateResetConfig {
  /** Global state snapshot (all states will be reset to it). */
  STATE_SLICE?: {};
}

/** Injection token for `RtStateReset` module. */
export const RtStateResetConfigToken = new InjectionToken<RtStateResetConfig>('RtStateResetConfig');

/** Default config for `RtStateReset` module. */
export const defaultConfig: RtStateResetConfig = {
  STATE_SLICE: {},
};
