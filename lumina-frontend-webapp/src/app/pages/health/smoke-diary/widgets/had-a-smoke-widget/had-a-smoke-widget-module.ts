import { NgModule } from '@angular/core';

import { BaseSmokeWidgetModule } from '../base-smoke-widget/base-smoke-widget-module';

import { HadASmokeWidgetComponent } from './had-a-smoke-widget-component';

@NgModule({
  declarations: [HadASmokeWidgetComponent],
  exports: [HadASmokeWidgetComponent],
  imports: [BaseSmokeWidgetModule],
})
export class HadASmokeWidgetModule {}
