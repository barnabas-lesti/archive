import { NgModule } from '@angular/core';

import { SmokeDiaryRoutingModule } from './smoke-diary-routing-module';
import { SmokeDiaryComponent } from './smoke-diary-component';

import { AverageTimeBetweenEntriesWidgetModule } from './widgets/average-time-between-entries-widget/average-time-between-entries-widget-module';
import { HadASmokeWidgetModule } from './widgets/had-a-smoke-widget/had-a-smoke-widget-module';
import { LastSmokeWidgetModule } from './widgets/last-smoke-widget/last-smoke-widget-module';
import { SmokesADayWidgetModule } from './widgets/smokes-a-day-widget/smokes-a-day-widget-module';

@NgModule({
  declarations: [SmokeDiaryComponent],
  imports: [
    SmokeDiaryRoutingModule,

    AverageTimeBetweenEntriesWidgetModule,
    HadASmokeWidgetModule,
    LastSmokeWidgetModule,
    SmokesADayWidgetModule,
  ],
})
export class SmokeDiaryModule {}
