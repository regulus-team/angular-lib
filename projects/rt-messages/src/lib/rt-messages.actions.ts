import { MessageType } from './symbols';

export class InfoMessage {
  static type = '[Messages] InfoMessage';
  readonly messageType = MessageType.INFO;
  constructor(public text: string, public timeout: number = 0, ) { }
}

export class DebugMessage {
  static type = '[Messages] DebugMessage';
  readonly messageType = MessageType.DEBUG;
  constructor(public text: string, public timeout: number = 0, ) { }
}

export class WarningMessage {
  static type = '[Messages] WarrningMessage';
  readonly messageType = MessageType.WARNING;
  constructor(public text: string, public timeout: number = 0, ) { }
}

export class SuccessMessage {
  static type = '[Messages] SuccessMessage';
  readonly messageType = MessageType.SUCCESS;
  constructor(public text: string, public timeout: number = 0, ) {}
}

export class ErrorMessage {
  static type = '[Messages] ErrorMessage';
  readonly messageType = MessageType.ERROR;
  constructor(public text: string, public timeout: number = 0, ) {}
}

export class SuccessMessages {
  static type = '[Messages] MessagesSuccess';
  constructor(public text: string[], public timeout: number = 0, ) {}
}

export class ErrorMessages {
  static type = '[Messages] ErrorMessages';
  constructor(public text: string[], public timeout: number = 0, ) {}
}

export class BackendError {
  static type = '[Messages] BackendError';
  constructor(public error: any, public timeout: number = 0, ) {}
}

export class DelayForClearState {
  static type = '[Messages] DelayForClearState';
}

export class ClearMessages {
  static type = '[Messages] ClearMessages';
}

export class ForgotAboutDuplicate {
  static type = '[Messages] ForgotAboutDuplicate';
}

export class CleanByIndex {
  static type = '[Messages] CleanByIndex';
  constructor(public index: number, public clicked = false) {}
}

export class SubscribeToRouter {
  static type = '[Messages] SubscribeToRouter';
}

export class CleanById {
  static type = '[Messages] CleanById';
  constructor(public id: number) {}
}
