import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaEmpleadoPage } from './alta-empleado.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AltaEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule, FormsModule, ReactiveFormsModule],
})
export class AltaEmpleadoPageRoutingModule {}
