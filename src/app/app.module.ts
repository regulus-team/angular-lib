import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {settings} from '../environments/environment';
import {Settings} from '../conf/settings';
import {RtPlatformModule} from '../../projects/rt-platform/src/lib/rt-platform.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RtPlatformModule.forRoot({
      localBaseUrl: settings.BASE_URL,
    }),
  ],
  providers: [
    {provide: Settings, useValue: settings},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
