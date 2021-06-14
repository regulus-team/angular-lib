# About
RT Platform

Module provide service that:
* may return base url depends on data provided in configs;
* may check if current environment is browser or server;

# Usage

Import `RtPlatformModule` into your module and provide configs (see `RtPlatformConfig` for more details),


```

import {RtUpdatesManagerModule} from './rt-updates-manager/rt-updates-manager.module';
import {RtStatesResetPlugin} from './rt-states-reset/rt-states-reset.plugin';

@NgModule({  
  imports: 
    ...
    RtPlatformModule.forRoot({
      localBaseUrl: settings.BASE_URL,
      serverBaseUrl: 'some_server_url',
    }),
  ...
})
export class SomeModule {}
```



