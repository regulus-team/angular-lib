import { RtMessagesModule } from './rt-messages.module';

describe('MessagesModule', () => {
  let messagesModule: RtMessagesModule;

  beforeEach(() => {
    messagesModule = new RtMessagesModule();
  });

  it('should create an instance', () => {
    expect(messagesModule).toBeTruthy();
  });
});
