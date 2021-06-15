import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { RtMessagesState } from './rt-messages.state';


@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      RtMessagesState,
    ]),
  ],
  declarations: [],
  exports: []
})
export class RtMessagesModule { }
