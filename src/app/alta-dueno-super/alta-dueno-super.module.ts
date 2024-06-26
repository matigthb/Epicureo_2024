import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaDuenoSuperPageRoutingModule } from './alta-dueno-super-routing.module';

import { AltaDuenoSuperPage } from './alta-dueno-super.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaDuenoSuperPageRoutingModule
  ],
  declarations: [AltaDuenoSuperPage]
})
export class AltaDuenoSuperPageModule {}
