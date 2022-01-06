import { NgModule } from '@angular/core';

import { ConfigModule } from './config/config-module';
import { DateModule } from './date/date-module';
import { EventModule } from './event/event-module';
import { UserModule } from './user/user-module';

@NgModule({
  imports: [
    ConfigModule,
    DateModule,
    EventModule,
    UserModule,
  ],
})
export class CommonAppModules {}
