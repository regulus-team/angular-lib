# RT States Reset v.0.0.1

Module provide plugin that update (or reset) state values on `StateResetAll` action.

This may be useful if you find NGXS Reset Plugin works wrong with NGXS Storage Plugin
(Storage Plugin restore data after reset).


# Usage
Import `RtStateResetModule` into your module and add it as provider:
```
import {RtStateResetModule} from 'rt-states-reset';

@NgModule({  
  imports: [
    RtStateResetModule.forRoot({
      stateSlice: settings.SOME_STATE_RESET_DATA,
    }),
  ],
  ...
})
export class AppModule {}
```

Call `StateResetAll` action in your code:
```
...
ctx.dispatch(new StateResetAll());
```

# Changes history
`v.0.0.0` - copy rt-states-reset module from exiting projects

`v.0.0.1` - move STATES_SLICE variable from settings to injected configs
