import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'smoke-diary',
    loadChildren: () => import('./smoke-diary/smoke-diary-module').then(({ SmokeDiaryModule }) => SmokeDiaryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthRoutingModule {}
