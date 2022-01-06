import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxsModule} from '@ngxs/store';
import {RtMessagesState} from './rt-messages.state';
import {RtMessagesConfig, RtMessagesConfigToken} from './symbols';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      RtMessagesState,
    ]),
  ],
})
export class RtMessagesModule {
  static forRoot(config?: RtMessagesConfig): ModuleWithProviders<RtMessagesModule> {
    return {
      ngModule: RtMessagesModule,
      providers: [
        {
          provide: RtMessagesConfigToken,
          useValue: config,
        },
      ],
    };
  }
}
