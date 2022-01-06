import { NgModule } from '@angular/core';

import { BaseSmokeWidgetModule } from '../base-smoke-widget/base-smoke-widget-module';

import { AverageTimeBetweenEntriesWidgetComponent } from './average-time-between-entries-widget-component';

@NgModule({
  declarations: [AverageTimeBetweenEntriesWidgetComponent],
  exports: [AverageTimeBetweenEntriesWidgetComponent],
  imports: [BaseSmokeWidgetModule],
})
export class AverageTimeBetweenEntriesWidgetModule {}
