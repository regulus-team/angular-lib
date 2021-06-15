import {getActionTypeFromInstance, NgxsPlugin} from '@ngxs/store';
import {Inject, Injectable, Optional} from '@angular/core';
import {StateResetAll} from './rt-state-reset.actions';
import {defaultConfig, RtStateResetConfig, RtStateResetConfigToken} from './symbols';


@Injectable()
export class RtStateResetPlugin implements NgxsPlugin {
  constructor( @Optional() @Inject(RtStateResetConfigToken) injectedConfig: RtStateResetConfig) {
    /** merge with default config & save in local variable (so it will be never undefined) */
    this.config = Object.assign(defaultConfig, injectedConfig);
  }
  private readonly config: RtStateResetConfig;

  /**
   * reset plugin works wrong with storage plugin (storage overwrite reset changes)
   * this plugin will reset states correctly (set default values using `STATE_RESET_DATA_SLICE` param)
   */
  handle(state, action, next): () => {} {
    if (getActionTypeFromInstance(action) === StateResetAll.type) {
      state = {
        ...state,
        ...this.config.stateSlice,
      };
    }
    return next(state, action);
  }
}
