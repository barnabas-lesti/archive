import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'health',
    loadChildren: () => import('./pages/health/health-module').then(({ HealthModule }) => HealthModule),
  },
  {
    path: 'prototype',
    loadChildren: () => import('./pages/prototype/prototype-module').then(({ PrototypeModule }) => PrototypeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
