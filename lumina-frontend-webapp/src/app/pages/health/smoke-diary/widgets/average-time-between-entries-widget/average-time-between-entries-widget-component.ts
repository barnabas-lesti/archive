import { Component, OnInit } from '@angular/core';

import { DateService } from '../../../../../common';
import { SmokeDiaryService } from '../../smoke-diary-service';

type SelectorValue = 'today' | 'past-3-days' | 'past-7-days';
interface SelectorOption {
  label: string;
  value: SelectorValue;
}

@Component({
  selector: 'app-average-time-between-smokes-widget',
  templateUrl: './average-time-between-entries-widget-component.html',
  styleUrls: ['./average-time-between-entries-widget-component.scss']
})
export class AverageTimeBetweenEntriesWidgetComponent implements OnInit {
  isLoading = false;
  averageTime = '';
  selectorValue: SelectorValue = 'today';
  selectorOptions: SelectorOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'Past 3 days', value: 'past-3-days' },
    { label: 'Past 7 days', value: 'past-7-days' },
  ];

  constructor(
    private readonly dateService: DateService,
    private readonly smokeDiaryService: SmokeDiaryService,
  ) {}

  ngOnInit(): void {
    this.smokeDiaryService.onCreateSmokeDiaryEntry(() => {
      this.loadAverageTime();
    });

    this.loadAverageTime();
  }

  async getAverageTime(): Promise<string> {
    const now = this.dateService.now();

    let startDate: Date;
    switch (this.selectorValue) {
      case 'past-3-days':
        startDate = this.dateService.subtractFromDate(now, 2, 'days');
        break;
      case 'past-7-days':
        startDate = this.dateService.subtractFromDate(now, 6, 'days');
        break;
      default:
        startDate = now;
    }

    const timeInMs = await this.smokeDiaryService
      .getAverageTimeBetweenSmokeDiaryEntriesInMs(startDate, now);

    return this.dateService.createTimerStringFromMs(timeInMs);
  }

  async loadAverageTime(): Promise<void> {
    this.isLoading = true;
    this.averageTime = await this.getAverageTime();
    this.isLoading = false;
  }
}
