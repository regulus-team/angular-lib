# About

RT States Reset v.0.0.1

Module provide plugin that may update (or reset) state values on `StateResetAll` action.

This may be useful if you find NGXS Reset Plugin works wrong
(for example, if used with NGXS Storage Plugin data will be restored after reset).


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
...
```

# API

Actions:
* `StateResetAll` - reset all states to object provided in configs (empty by default).

Configs API: 
* `STATE_SLICE` - (optional) state snapshot object. State will be reset to it on action call.

# Example

Simple usage:

```
import {RtStateResetModule} from 'rt-state-reset';


@NgModule({
  ...
  imports: [
    ...
    RtStateResetModule.forRoot({
      STATE_SLICE: settings.EXAMPLE_STATE_RESET,
    }),
    ...
  ],
  ...
})
export class MyModule {
}
```
