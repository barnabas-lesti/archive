import { Component, OnInit } from '@angular/core';

import { DateService } from '../../../../../common';
import { SmokeDiaryService } from '../../smoke-diary-service';
import { SmokeDiaryEntry } from '../../interfaces';

@Component({
  selector: 'app-last-smoke-widget',
  templateUrl: './last-smoke-widget-component.html',
  styleUrls: ['./last-smoke-widget-component.scss']
})
export class LastSmokeWidgetComponent implements OnInit {
  isLoading = false;
  timer = '';

  latestSmokeDiaryEntry: SmokeDiaryEntry | null;

  constructor(
    private readonly dateService: DateService,
    private readonly smokeDiaryService: SmokeDiaryService,
  ) {}

  ngOnInit(): void {
    window.setInterval(() => {
      this.updateTimer();
    }, 1000);

    this.smokeDiaryService.onCreateSmokeDiaryEntry(createdSmokeDiaryEntry => {
      if (!this.latestSmokeDiaryEntry) {
        this.latestSmokeDiaryEntry = createdSmokeDiaryEntry;
      } else if (this.latestSmokeDiaryEntry.dateTime < createdSmokeDiaryEntry.dateTime) {
        this.latestSmokeDiaryEntry = createdSmokeDiaryEntry;
      }
    });

    this.loadDateTime();
  }

  updateTimer(): void {
    const elapsedTimeInMs = this.latestSmokeDiaryEntry ?
      this.dateService.now().getTime() - this.latestSmokeDiaryEntry.dateTime.getTime() : 0;
    this.timer = this.dateService.createTimerStringFromMs(elapsedTimeInMs);
  }

  async loadDateTime(): Promise<void> {
    this.isLoading = true;
    this.latestSmokeDiaryEntry = await this.smokeDiaryService.getLatestSmokeDiaryEntry();
    this.updateTimer();
    this.isLoading = false;
  }
}
