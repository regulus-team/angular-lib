import {ModuleWithProviders, NgModule} from '@angular/core';
import {RtStateResetConfig, RtStateResetConfigToken} from './symbols';
import {NGXS_PLUGINS} from '@ngxs/store';
import {RtStateResetPlugin} from './rt-state-reset.plugin';


@NgModule()
export class RtStateResetModule {
  static forRoot(config?: RtStateResetConfig): ModuleWithProviders<RtStateResetModule> {
    return {
      ngModule: RtStateResetModule,
      providers: [
        {
          provide: RtStateResetConfigToken,
          useValue: config,
        },
        {
          provide: NGXS_PLUGINS,
          useClass: RtStateResetPlugin,
          multi: true,
        },
      ],
    };
  }
}
