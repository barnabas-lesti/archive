import { NgModule } from '@angular/core';

import { LayoutModule } from './common/layout';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app-component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    LayoutModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
