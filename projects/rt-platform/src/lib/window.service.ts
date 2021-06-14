import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';


@Injectable()
export class WindowService {
  private readonly _window: Window;

  constructor(@Inject(PLATFORM_ID) platformId) {
    if (!isPlatformBrowser(platformId)) {
      this._window = {navigator: {userAgent: 'fakeAgent'}} as Window;
    } else {
      this._window = window;
    }
  }

  get nativeWindow(): Window {
    return this._window;
  }
}

export const WINDOW = new InjectionToken<Window>('ng-toolkit-window');
