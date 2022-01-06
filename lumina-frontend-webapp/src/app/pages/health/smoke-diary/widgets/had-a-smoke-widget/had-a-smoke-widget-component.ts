import { Component, OnInit } from '@angular/core';

import { DateService } from '../../../../../common';
import { SmokeDiaryService } from '../../smoke-diary-service';

type SelectorValue = 'now' | 'dateTime';
interface SelectorOption {
  label: string;
  value: SelectorValue;
}

@Component({
  selector: 'app-had-a-smoke-widget',
  templateUrl: './had-a-smoke-widget-component.html',
  styleUrls: ['./had-a-smoke-widget-component.scss']
})
export class HadASmokeWidgetComponent implements OnInit {
  isLoading = false;
  showConfirmation = false;
  selectorValue: SelectorValue = 'now';
  selectorOptions: SelectorOption[] = [
    { label: 'Now', value: 'now' },
    { label: 'At date time', value: 'dateTime' },
  ];

  dateTime: Date;
  maxDate: Date;

  constructor(
    private readonly dateService: DateService,
    private readonly smokeDiaryService: SmokeDiaryService,
  ) {}

  ngOnInit(): void {
    this.dateTime = this.dateService.now();
    this.maxDate = this.dateService.now();
  }

  updateMaxDate(): void {
    this.maxDate = this.dateService.now();
  }

  requestConfirmation(): void {
    this.showConfirmation = true;
  }

  cancel(): void {
    this.showConfirmation = false;
  }

  async confirm(): Promise<void> {
    this.isLoading = true;
    await this.smokeDiaryService.createSmokeDiaryEntry(this.getDateTime());
    this.isLoading = false;
    this.showConfirmation = false;
  }

  private getDateTime(): Date {
    return this.selectorValue === 'now' ? this.dateService.now() : this.dateTime;
  }
}
