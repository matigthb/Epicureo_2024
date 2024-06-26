import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltasPageRoutingModule } from './altas-routing.module';

import { AltasPage } from './altas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltasPageRoutingModule
  ],
  declarations: [AltasPage]
})
export class AltasPageModule {}
