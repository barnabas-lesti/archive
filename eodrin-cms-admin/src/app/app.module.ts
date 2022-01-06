import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IconComponent } from './common/icon/icon.component';

@NgModule({
	declarations: [
		AppComponent,
		IconComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
