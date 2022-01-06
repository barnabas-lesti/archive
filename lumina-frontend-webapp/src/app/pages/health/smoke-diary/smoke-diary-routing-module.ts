import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmokeDiaryComponent } from './smoke-diary-component';

const routes: Routes = [
  {
    path: '',
    component: SmokeDiaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmokeDiaryRoutingModule {}
