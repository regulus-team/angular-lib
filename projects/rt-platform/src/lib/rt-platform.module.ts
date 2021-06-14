import {ModuleWithProviders, NgModule} from '@angular/core';
import {WINDOW, WindowService} from './window.service';
import {factoryFn, RtPlatformConfig, RtPlatformConfigToken} from './rt-platform.model';
import {RtPlatformService} from './rt-platform.service';


@NgModule()
export class RtPlatformModule {
  static forRoot(config?: RtPlatformConfig): ModuleWithProviders<RtPlatformModule> {
    return {
      ngModule: RtPlatformModule,
      providers: [
        RtPlatformService,
        WindowService,
        {
          provide: WINDOW,
          useFactory: factoryFn,
          deps: [WindowService],
        },
        {
          provide: RtPlatformConfigToken,
          useValue: config,
        },
      ],
    };
  }
}
