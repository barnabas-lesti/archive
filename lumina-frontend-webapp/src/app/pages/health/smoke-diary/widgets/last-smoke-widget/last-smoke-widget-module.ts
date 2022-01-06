import { NgModule } from '@angular/core';

import { BaseSmokeWidgetModule } from '../base-smoke-widget/base-smoke-widget-module';
import { LastSmokeWidgetComponent } from './last-smoke-widget-component';

@NgModule({
  declarations: [LastSmokeWidgetComponent],
  exports: [LastSmokeWidgetComponent],
  imports: [BaseSmokeWidgetModule],
})
export class LastSmokeWidgetModule {}
