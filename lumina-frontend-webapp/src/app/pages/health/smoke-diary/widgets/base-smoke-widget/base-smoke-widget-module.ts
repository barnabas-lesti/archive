import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

import { CommonAppModules } from '../../../../../common';

import { SmokeDiaryRepository } from '../../smoke-diary-repository';
import { SmokeDiaryService } from '../../smoke-diary-service';

import { BaseSmokeWidgetComponent } from './base-smoke-widget-component';

@NgModule({
  declarations: [BaseSmokeWidgetComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    CommonAppModules,

    ButtonModule,
    CalendarModule,
    CardModule,
    DropdownModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    ButtonModule,
    CalendarModule,
    CardModule,
    DropdownModule,

    BaseSmokeWidgetComponent,
  ],
  providers: [
    SmokeDiaryRepository,
    SmokeDiaryService,
  ],
})
export class BaseSmokeWidgetModule {}
