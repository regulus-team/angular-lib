import {Settings} from './settings';

export class SettingsDevelop extends Settings {
  BASE_URL = 'http://localhost:4200';
  EXAMPLE_STATE_RESET = { exampleState: { user: null, } };
}
