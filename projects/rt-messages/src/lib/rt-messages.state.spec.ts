import { Store, NgxsModule, StateContext, Actions } from '@ngxs/store';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RtMessagesState, MessagesStateModel, Message } from './rt-messages.state';
import { Router, NavigationStart } from '@angular/router';
import { filter, skipUntil, take, map } from 'rxjs/operators';
import {
  BackendError, ClearMessages,
  CleanByIndex, ErrorMessage, SuccessMessage,
  DebugMessage, InfoMessage, WarningMessage
} from './rt-messages.actions';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable, timer, Subscriber } from 'rxjs';
// import { pipe } from '@angular/core/src/render3/pipe';
import { Settings } from '../../conf/settings';
import { MessageType } from './symbols';
import { NgZone } from '@angular/core';

class MockStateContext<T> implements StateContext<T> {
  sets = [];
  patches = [];
  dispatches = [];

  constructor(private _state) { }

  getState() {
    return this._state as T;
  }
  /**
   * Reset the state to a new value.
   */
  setState(state) {
    this.sets.push(state);
    this._state = state;
    return this._state;
  }
  /**
   * Patch the existing state with the provided value.
   */
  patchState(partial) {
    this.patches.push(partial);
    this._state = {
      ...this._state,
      ...partial
    };
    return this._state;
  }
  /**
   * Dispatch a new action and return the dispatched observable.
   */
  dispatch(actions: any | any[]) {
    this.dispatches.push(actions);
    return of() as Observable<void>;
  }
}

const SOME_DESIRED_STATE: MessagesStateModel = {
  messages: [],
  backendError: null,
  lastTimeMsgInvoked: null,
  isLastMsgDuplicate: null,
  latestMessage: null,
};

const ERROR = {
  error: {
    non_field_errors: [
      'Unable to log in with provided credentials.'
    ]
  },
  headers: {}
};

const MESSAGE: Message = {
  id: 0,
  type: MessageType.ERROR,
  text: 'Error 404',
};

const SUCCESS_MESSAGE: Message = {
  id: 0,
  type: MessageType.SUCCESS,
  text: 'Succees 200',
};
class MockRouter {
  events = {} as NavigationStart;
  getEvent() {
    return this.events;
  }
}

const EXAMPLESTATE: MessagesStateModel = SOME_DESIRED_STATE;

describe('MessageState', () => {
  let store: Store;

  let actions$: Actions;
  let ctx: StateContext<MessagesStateModel>;
  let dispatched = [];
  let state: RtMessagesState;
  let settings: Settings;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([RtMessagesState])],
      providers: [
        { provide: Settings },
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    store.reset({ messages: EXAMPLESTATE });
    settings = TestBed.inject(Settings);
    state = new RtMessagesState(store, settings);

    actions$ = TestBed.inject(Actions);
    dispatched = [];
    actions$.pipe(
      filter(x => x.status === 'DISPATCHED')
    ).subscribe(x => dispatched.push(x.action));
  }));

  it('should test the action ErrorMessage', () => {
    store.dispatch(new ErrorMessage('Error'));
    expect(dispatched.length).toEqual(1);
    const newMessage = new Message(0, MessageType.ERROR, 'Error');
    expect(dispatched[0].text).toEqual(newMessage.text);
    expect(dispatched[0].messageType).toEqual(newMessage.type);
  });

  it('should test the action SuccessMessage', () => {
    store.dispatch(new SuccessMessage('Welcome'));
    expect(dispatched.length).toEqual(1);
    const newMessage = new Message(0, MessageType.SUCCESS, 'Welcome');
    expect(dispatched[0].text).toEqual(newMessage.text);
    expect(dispatched[0].messageType).toEqual(newMessage.type);
  });

  it('should test the action DebugMessage', () => {
    store.dispatch(new DebugMessage('Debug'));
    expect(dispatched.length).toEqual(1);
    const newMessage = new Message(0, MessageType.DEBUG, 'Debug');
    expect(dispatched[0].text).toEqual(newMessage.text);
    expect(dispatched[0].messageType).toEqual(newMessage.type);
  });

  it('should test the action InfoMessage', () => {
    store.dispatch(new InfoMessage('Info'));
    expect(dispatched.length).toEqual(1);
    const newMessage = new Message(0, MessageType.INFO, 'Info');
    expect(dispatched[0].text).toEqual(newMessage.text);
    expect(dispatched[0].messageType).toEqual(newMessage.type);
  });

  it('should test the action WarrningMessage', () => {
    store.dispatch(new WarningMessage('Warrning'));
    expect(dispatched.length).toEqual(1);
    const newMessage = new Message(0, MessageType.WARNING, 'Warrning');
    expect(dispatched[0].text).toEqual(newMessage.text);
    expect(dispatched[0].messageType).toEqual(newMessage.type);
  });


  it('should test the action BackendError', () => {
    store.dispatch(new BackendError(ERROR));
    expect(dispatched.length).toEqual(2);
    expect(dispatched[1] instanceof ErrorMessage).toBeTruthy();
    expect(dispatched[1].text).toEqual(ERROR.error['non_field_errors'][0]);
  });

  // // Tests with using MockStateContext

  it('should test the action ClearMessages', () => {
    ctx = new MockStateContext(state) as StateContext<MessagesStateModel>;
    ctx.patchState({
      messages: [MESSAGE, SUCCESS_MESSAGE],
      backendError: ERROR
    });
    ctx.patchState({
      messages: [...ctx.getState().messages, MESSAGE],
      backendError: [ctx.getState().backendError, ERROR]
    });
    expect(ctx.getState().messages.length).toEqual(3);
    expect(ctx.getState().backendError.length).toEqual(2);
    state.clearMessages(ctx);

    expect(ctx.getState().messages.length).toEqual(0);
    expect(ctx.getState().backendError).toBeNull();
  });

  it('should test the action CleanByIndex with two messages', () => {
    ctx = new MockStateContext(state) as StateContext<MessagesStateModel>;
    ctx.patchState({
      messages: [MESSAGE, SUCCESS_MESSAGE],
      backendError: ERROR
    });
    ctx.patchState({
      messages: [...ctx.getState().messages, MESSAGE],
      backendError: [ctx.getState().backendError, ERROR]
    });

    expect(ctx.getState().messages.length).toEqual(3);
    expect(ctx.getState().backendError.length).toEqual(2);
    state.cleanByIndex(ctx, new CleanByIndex(1));

    expect(ctx.getState().messages.length).toEqual(2);
    expect(ctx.getState().backendError.length).toEqual(2);
  });

  it('should test the action CleanByIndex with one message', () => {
    ctx = new MockStateContext(state) as StateContext<MessagesStateModel>;
    spyOn(ctx, 'dispatch');
    ctx.patchState({
      messages: [MESSAGE],
      backendError: ERROR
    });
    expect(ctx.getState().messages.length).toEqual(1);
    expect(ctx.getState().backendError).toEqual(ERROR);
    state.cleanByIndex(ctx, new CleanByIndex(1));
    expect(ctx.dispatch).toHaveBeenCalledWith(jasmine.any(ClearMessages));
  });

  // // END

  // // Selectors

  it('should return user from getMessages selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.messages(Messages);
    expect(dataFromSelector).toEqual([MESSAGE, MESSAGE]);
  });

  it('should return user from getBackendError selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.backendError(Messages);
    expect(dataFromSelector).toEqual(ERROR);
  });

  it('should return user from getBackendError selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.backendError(Messages);
    expect(dataFromSelector).toEqual(ERROR);
  });

  it('should return user from getErrorMessages selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.errorMessages(Messages);
    expect(dataFromSelector).toEqual([MESSAGE, MESSAGE]);
  });

  it('should return user from getSuccessMessages selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.successMessages(Messages);
    expect(dataFromSelector).toEqual([]);
  });

  it('should return user from getSuccessMessages selector', () => {
    const Messages: MessagesStateModel = {
      messages: [MESSAGE, MESSAGE, SUCCESS_MESSAGE],
      backendError: ERROR,
      lastTimeMsgInvoked: null,
      isLastMsgDuplicate: null,
      latestMessage: null,
    };
    const dataFromSelector = RtMessagesState.successMessages(Messages);
    expect(dataFromSelector).toEqual([SUCCESS_MESSAGE]);
  });

});
