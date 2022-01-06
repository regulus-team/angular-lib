import {getActionTypeFromInstance, NgxsPlugin} from '@ngxs/store';
import {Inject, Injectable, Optional} from '@angular/core';
import {StateResetAll} from './rt-state-reset.actions';
import {defaultConfig, RtStateResetConfig, RtStateResetConfigToken} from './symbols';


@Injectable()
export class RtStateResetPlugin implements NgxsPlugin {
  constructor( @Optional() @Inject(RtStateResetConfigToken) injectedConfig: RtStateResetConfig) {
    // Merge provided config with default values (so it never will be undefined).
    this.config = Object.assign(defaultConfig, injectedConfig);
  }

  /** Current module config. */
  private config: RtStateResetConfig;

  /**
   * Reset plugin works wrong with storage plugin (storage overwrite reset changes)
   * This plugin will reset states correctly (set default values using `STATE_RESET_DATA_SLICE` param)
   */
  handle(state, action, next): () => {} {
    if (getActionTypeFromInstance(action) === StateResetAll.type) {
      state = {
        ...state,
        ...this.config.STATE_SLICE,
      };
    }
    return next(state, action);
  }
}
