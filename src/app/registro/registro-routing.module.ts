import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroPage } from './registro.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
})
export class RegistroPageRoutingModule {}
