import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {Action, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import {Inject, Injectable, Optional} from '@angular/core';
import {RouterNavigation} from '@ngxs/router-plugin';
import {takeRight, uniqueId} from 'lodash';
import {
  BackendError,
  CleanById,
  CleanByIndex,
  ClearMessages,
  DebugMessage,
  DelayForClearState,
  ErrorMessage,
  ForgotAboutDuplicate,
  InfoMessage,
  SuccessMessage,
  WarningMessage,
} from './rt-messages.actions';
import {defaultConfig, MessageType, RtMessagesConfig, RtMessagesConfigToken} from './symbols';


export class Message {
  constructor(
    public id: number,
    public type: string,
    public text: string,
    public data?: any,
    public timeout?: number
  ) {
  }
}

export class MessagesStateModel {
  messages: Message[];
  latestMessage: Message;
  backendError: any;
  lastTimeMsgInvoked: number;
  isLastMsgDuplicate: boolean;
}


@State<MessagesStateModel>({
  name: 'messages',
  defaults: {
    messages: [],
    latestMessage: null,
    backendError: null,
    lastTimeMsgInvoked: null,
    isLastMsgDuplicate: false,
  },
})
@Injectable()
export class RtMessagesState implements NgxsOnInit {
  constructor(
    private store: Store,
    @Optional() @Inject(RtMessagesConfigToken) injectedConfig: RtMessagesConfig,
  ) {
    // Merge provided config with default values (so it never will be undefined).
    this.config = Object.assign(defaultConfig, injectedConfig);
  }

  /** Current module config. */
  private config: RtMessagesConfig;

  @Selector()
  static messages(state: MessagesStateModel): Message[] {
    return state.messages;
  }

  @Selector()
  static latestMessage(state: MessagesStateModel): Message {
    return state.latestMessage;
  }

  @Selector()
  static backendError(state: MessagesStateModel): any {
    return state.backendError;
  }

  @Selector()
  static errorMessages(state: MessagesStateModel): Message[] {
    return state.messages.filter(data => data.type === MessageType.ERROR);
  }

  @Selector()
  static successMessages(state: MessagesStateModel): Message[] {
    return state.messages.filter(data => data.type === MessageType.SUCCESS);
  }

  @Selector()
  static lastMessageDuplicate(state: MessagesStateModel): boolean {
    return state.isLastMsgDuplicate;
  }

  ngxsOnInit(ctx: StateContext<MessagesStateModel>): void {
  }

  @Action(RouterNavigation)
  routerNavigation(ctx: StateContext<MessagesStateModel>): void {
    ctx.dispatch(new DelayForClearState());
  }

  @Action([InfoMessage, WarningMessage, ErrorMessage, DebugMessage, SuccessMessage])
  createMessage(ctx: StateContext<MessagesStateModel>, message): void {
    const id = uniqueId();
    const updTime = Date.now();
    const newMessage = new Message(id, message.messageType, message.text);
    newMessage.timeout = message.timeout || 0;
    const state = ctx.getState();

    const idx = state.messages.findIndex(msg => msg.text === newMessage.text);
    if (idx !== -1) {
      // if same msg exist
      if (idx === state.messages.length - 1 && state.messages.length !== 0) {
        // and is last
        ctx.patchState({
          isLastMsgDuplicate: true,
        });
        return;
      }
      this.store.dispatch(new CleanById(state.messages[idx].id)); // !last => remove
    }

    const limitedMessages = takeRight(state.messages, this.config.MESSAGES_LIMIT - 1);
    ctx.patchState({
      messages: [...limitedMessages, newMessage],
      latestMessage: newMessage,
      lastTimeMsgInvoked: updTime,
    });
    const messagesTimeout = message.timeout || this.config.MESSAGES_TIMEOUT;
    if (messagesTimeout) {
      timer(messagesTimeout * 1000)
        .pipe(take(1))
        .subscribe(() => this.store.dispatch(new CleanById(id))); // REVIEW check subscribe
    }
  }

  @Action(BackendError)
  backendError(ctx: StateContext<MessagesStateModel>, data: BackendError): void {
    ctx.patchState({
      backendError: data.error,
    });

    if (data.error && data.error.error && data.error.error.non_field_errors && data.error.error.non_field_errors.length) {
      for (const text of data.error.error.non_field_errors) {
        ctx.dispatch(new ErrorMessage(text));
      }
      return;
    }

    if (data.error && data.error.error && data.error.error.message) {
      ctx.dispatch(new ErrorMessage(data.error.error.message));
    }

    if (data.error && data.error.error && data.error.error.error) {
      ctx.dispatch(new ErrorMessage(data.error.error.error));
    }

    if (data.error && data.error.status === 504 && typeof data.error.error === 'string') {
      ctx.dispatch(new ErrorMessage(data.error.error));
      return;
    }
    if (data.error && data.error.error && data.error.error.detail) {
      ctx.dispatch(new ErrorMessage(data.error.error.detail));
      return;
    }
    if (data.error.detail) {
      ctx.dispatch(new ErrorMessage(data.error.detail));
    }
  }

  @Action(DelayForClearState)
  delayForClearState(ctx: StateContext<MessagesStateModel>): void {
    const state = ctx.getState();
    if (state.lastTimeMsgInvoked) {
      const updTime: number = state.lastTimeMsgInvoked + this.config.MESSAGES_TIMEOUT;

      if (updTime < Date.now()) {
        ctx.dispatch(new ClearMessages());
      }
    }
  }

  @Action(ClearMessages)
  clearMessages(ctx: StateContext<MessagesStateModel>): void {
    ctx.patchState({
      messages: [],
      backendError: null,
      lastTimeMsgInvoked: null,
    });
  }

  @Action(ForgotAboutDuplicate)
  forgotAboutDuplicate(ctx: StateContext<MessagesStateModel>): void {
    ctx.patchState({
      isLastMsgDuplicate: false,
    });
  }

  @Action(CleanByIndex)
  cleanByIndex(ctx: StateContext<MessagesStateModel>, {index}: CleanByIndex): void {
    const state = ctx.getState().messages;

    if (state.length === 1) {
      ctx.dispatch(new ClearMessages());
    } else if (!!state.length && state.length !== 1) {
      ctx.patchState({
        messages: state.filter((message, i) => i !== index),
      });
    }
  }

  @Action(CleanById)
  cleanById(ctx: StateContext<MessagesStateModel>, {id}: CleanById): void {
    const state = ctx.getState().messages;
    ctx.patchState({
      messages: state.filter(m => m.id !== id),
    });
  }
}
