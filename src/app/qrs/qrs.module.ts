import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrsPageRoutingModule } from './qrs-routing.module';

import { QrsPage } from './qrs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrsPageRoutingModule
  ],
  declarations: [QrsPage]
})
export class QrsPageModule {}
