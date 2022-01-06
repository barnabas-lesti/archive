import { Component, OnInit } from '@angular/core';

import { DateService } from '../../../../../common';
import { SmokeDiaryService } from '../../smoke-diary-service';

type SelectorValue = 'today' | 'date';
interface SelectorOption {
  label: string;
  value: SelectorValue;
}

@Component({
  selector: 'app-smokes-a-day-widget',
  templateUrl: './smokes-a-day-widget-component.html',
  styleUrls: ['./smokes-a-day-widget-component.scss']
})
export class SmokesADayWidgetComponent implements OnInit {
  isLoading = false;
  numberOfSmokeDiaryEntries = 0;
  selectorValue: SelectorValue = 'today';
  selectorOptions: SelectorOption[] = [
    { label: 'Today', value: 'today' },
    { label: 'Date', value: 'date' },
  ];

  date: Date;
  lastSearchedDate: Date;

  constructor(
    private readonly dateService: DateService,
    private readonly smokeDiaryService: SmokeDiaryService,
  ) {}

  ngOnInit(): void {
    this.numberOfSmokeDiaryEntries = 0;
    this.date = this.dateService.now();

    this.smokeDiaryService.onCreateSmokeDiaryEntry(createdSmokeDiaryEntry => {
      if (
        this.dateService.dayStart(this.lastSearchedDate) < createdSmokeDiaryEntry.dateTime &&
        this.dateService.dayEnd(this.lastSearchedDate) > createdSmokeDiaryEntry.dateTime
      ) {
        this.numberOfSmokeDiaryEntries++;
      }
    });

    this.loadNumberOfSmokeDiaryEntries();
  }

  async getNumberOfSmokeDiaryEntries(): Promise<number> {
    this.lastSearchedDate = this.selectorValue === 'today' ? this.dateService.now() : this.date;
    return await this.smokeDiaryService.getNumberOfSmokeDiaryEntriesADay(this.lastSearchedDate);
  }

  async loadNumberOfSmokeDiaryEntries(): Promise<void> {
    this.isLoading = true;
    this.numberOfSmokeDiaryEntries = await this.getNumberOfSmokeDiaryEntries();
    this.isLoading = false;
  }
}
