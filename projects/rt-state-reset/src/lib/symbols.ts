import {InjectionToken} from '@angular/core';


export interface RtStateResetConfig {
  /** any global state data (provided state will be reset with given info) */
  stateSlice: {};
}

export const RtStateResetConfigToken = new InjectionToken<RtStateResetConfig>('RtStateResetConfig');

export const defaultConfig: RtStateResetConfig = {
  stateSlice: {},
};
