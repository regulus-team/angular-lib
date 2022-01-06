import {InjectionToken} from '@angular/core';

export enum MessageType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  DEBUG = 'debug',
  INFO = 'info'
}

export interface RtMessagesConfig {
  /** Delay between message appears and automatically disappear. */
  MESSAGES_TIMEOUT?: number; // ms
  /** Limit of messages that may exist on page simultaneously. */
  MESSAGES_LIMIT?: number;
}

export const RtMessagesConfigToken = new InjectionToken<RtMessagesConfig>('RtMessagesConfig');

export const defaultConfig: RtMessagesConfig = {
  MESSAGES_TIMEOUT: 5000,
  MESSAGES_LIMIT: 6,
};
