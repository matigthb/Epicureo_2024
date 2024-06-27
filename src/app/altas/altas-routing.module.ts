import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltasPage } from './altas.page';

const routes: Routes = [
  {
    path: '',
    component: AltasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltasPageRoutingModule {}
