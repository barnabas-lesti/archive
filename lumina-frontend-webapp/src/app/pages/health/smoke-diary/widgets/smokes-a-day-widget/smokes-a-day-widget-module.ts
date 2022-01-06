import { NgModule } from '@angular/core';

import { BaseSmokeWidgetModule } from '../base-smoke-widget/base-smoke-widget-module';

import { SmokesADayWidgetComponent } from './smokes-a-day-widget-component';

@NgModule({
  declarations: [SmokesADayWidgetComponent],
  exports: [SmokesADayWidgetComponent],
  imports: [BaseSmokeWidgetModule],
})
export class SmokesADayWidgetModule {}
