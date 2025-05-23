import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaDuenoSuperPage } from './alta-dueno-super.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AltaDuenoSuperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
})
export class AltaDuenoSuperPageRoutingModule {}
