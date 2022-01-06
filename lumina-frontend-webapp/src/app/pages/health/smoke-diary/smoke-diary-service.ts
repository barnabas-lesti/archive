import { Injectable } from '@angular/core';

import {
  DateService,
  EventService,
  UserService,
} from '../../../common';
import { SmokeDiaryEntry } from './interfaces';
import { SmokeDiaryRepository } from './smoke-diary-repository';

const CREATED_SMOKE_DIARY_ENTRY_EVENT = 'createdSmokeDiaryEntry';

@Injectable()
export class SmokeDiaryService {

  constructor(
    private readonly dateService: DateService,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly smokeDiaryRepository: SmokeDiaryRepository,
  ) {}

  async createSmokeDiaryEntry(dateTime: Date): Promise<SmokeDiaryEntry> {
    const { id: userId } = this.userService.getUser();
    const smokeDiaryEntry = await this.smokeDiaryRepository.createSmokeDiaryEntry({ userId, dateTime });
    this.eventService.emit(CREATED_SMOKE_DIARY_ENTRY_EVENT, smokeDiaryEntry);
    return smokeDiaryEntry;
  }

  onCreateSmokeDiaryEntry(handler: (createdSmokeDiaryEntry: SmokeDiaryEntry) => void): void {
    this.eventService.on(CREATED_SMOKE_DIARY_ENTRY_EVENT, handler);
  }

  async getNumberOfSmokeDiaryEntriesADay(date: Date): Promise<number> {
    const { id: userId } = this.userService.getUser();
    const startDateTime = this.dateService.dayStart(date);
    const endDateTime = this.dateService.dayEnd(date);

    const numberOfSmokeDiaryEntries = await this.smokeDiaryRepository.getNumberOfSmokeDiaryEntries({ userId, startDateTime, endDateTime });

    return numberOfSmokeDiaryEntries;
  }

  async getAverageTimeBetweenSmokeDiaryEntriesInMs(startDate: Date, endDate: Date): Promise<number> {
    const { id: userId } = this.userService.getUser();
    const startDateTime = this.dateService.dayStart(startDate);
    const endDateTime = this.dateService.dayEnd(endDate);

    const { averageTimeInMs } = await this.smokeDiaryRepository
      .getAverageTimeBetweenSmokeDiaryEntries({ userId, startDateTime, endDateTime });
    return averageTimeInMs;
  }

  async getLatestSmokeDiaryEntry(): Promise<SmokeDiaryEntry | null> {
    const { id: userId } = this.userService.getUser();
    return await this.smokeDiaryRepository.getLatestSmokeDiaryEntry(userId);
  }
}
