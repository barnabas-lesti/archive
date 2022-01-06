import { Injectable } from '@nestjs/common';
import * as uniqid from 'uniqid';

import {
  CreateSmokeDiaryEntryBodyDto,
  SmokeDiaryEntriesQueryDto,
} from './dtos';
import { SmokeDiaryEntry } from './interfaces';
import { SmokeDiaryRepository } from './smoke-diary-repository';

@Injectable()
export class SmokeDiaryService {
  constructor(private readonly smokeDiaryRepository: SmokeDiaryRepository) {}

  async createSmokeDiaryEntry(createSmokeEntryBody: CreateSmokeDiaryEntryBodyDto): Promise<SmokeDiaryEntry> {
    const { userId, utcDateTime } = createSmokeEntryBody;
    const entry: SmokeDiaryEntry = {
      id: uniqid(),
      userId,
      utcDateTime,
    };

    return await this.smokeDiaryRepository.createSmokeDiaryEntry(entry);
  }

  async getSmokeDiaryEntries(query: SmokeDiaryEntriesQueryDto): Promise<SmokeDiaryEntry[]> {
    return await this.smokeDiaryRepository.getSmokeDiaryEntries(query);
  }

  async getNumberOfSmokeDiaryEntries(query: SmokeDiaryEntriesQueryDto): Promise<number> {
    return await this.smokeDiaryRepository.getNumberOfSmokeDiaryEntries(query);
  }

  async getAverageTimeBetweenSmokeDiaryEntriesInMs(query: SmokeDiaryEntriesQueryDto): Promise<number> {
    const smokeEntries = await this.smokeDiaryRepository.getSmokeDiaryEntries(query);

    if (!smokeEntries.length) {
      return 0;
    }

    const totalTimeMs = smokeEntries.reduce((total, entry, index) => {
      const nextEntry = smokeEntries[index + 1];
      if (nextEntry) {
        const timeBetween = new Date(nextEntry.utcDateTime).getTime() - new Date(entry.utcDateTime).getTime();
        return total + timeBetween;
      } else {
        return total;
      }
    }, 0);

    const averageTimeInMs = totalTimeMs / smokeEntries.length;

    return averageTimeInMs;
  }

  async getLatestSmokeDiaryEntry(userId: string): Promise<SmokeDiaryEntry> {
    return await this.smokeDiaryRepository.getLatestSmokeDiaryEntry(userId);
  }
}
