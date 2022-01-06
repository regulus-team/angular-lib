import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {settings} from '../environments/environment';
import {Settings} from '../conf/settings';
import {RtPlatformModule} from 'rt-platform';
import {RtMessagesModule} from 'rt-messages';
import {RtStateResetModule} from 'rt-state-reset';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RtPlatformModule.forRoot({
      localBaseUrl: settings.BASE_URL,
    }),
    RtMessagesModule.forRoot({
      MESSAGES_TIMEOUT: 6000,
      MESSAGES_LIMIT: 8,
    }),
    RtStateResetModule.forRoot({
      STATE_SLICE: settings.EXAMPLE_STATE_RESET,
    }),
  ],
  providers: [
    {provide: Settings, useValue: settings},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
