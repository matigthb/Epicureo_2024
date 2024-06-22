import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrsPage } from './qrs.page';

const routes: Routes = [
  {
    path: '',
    component: QrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrsPageRoutingModule {}
