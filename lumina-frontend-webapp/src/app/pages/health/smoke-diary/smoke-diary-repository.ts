import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  ConfigService,
  DateService,
} from '../../../common';
import {
  CreateSmokeDiaryEntryBody,
  CreateSmokeDiaryEntryRequestBody,
  SmokeDiaryEntriesQuery,
  SmokeDiaryEntry,
  SmokeDiaryEntriesRequestQuery,
  SmokeDiaryEntryResponse,
  NumberOfSmokeDiaryEntriesResponse,
  AverageTimeBetweenSmokeDiaryEntriesResponse,
} from './interfaces';

const SMOKE_DIARY_API_PATH = '/health/smoke-diary';

@Injectable()
export class SmokeDiaryRepository {
  private smokeDiaryUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
  ) {
    this.smokeDiaryUrl = this.configService.get('apiUrl') + SMOKE_DIARY_API_PATH;
  }

  async createSmokeDiaryEntry(createSmokeDiaryEntryBody: CreateSmokeDiaryEntryBody): Promise<SmokeDiaryEntry> {
    const { userId, dateTime } = createSmokeDiaryEntryBody;
    const createSmokeDiaryEntryRequestBody: CreateSmokeDiaryEntryRequestBody = {
      userId,
      utcDateTime: dateTime.toISOString(),
    };

    const smokeDiaryEntryResponse = await this.httpClient
      .post(`${this.smokeDiaryUrl}/entries`, createSmokeDiaryEntryRequestBody)
      .toPromise() as SmokeDiaryEntryResponse;

    return {
      id: smokeDiaryEntryResponse.id,
      userId: smokeDiaryEntryResponse.userId,
      dateTime: this.dateService.toDate(smokeDiaryEntryResponse.utcDateTime),
    };
  }

  async getSmokeDiaryEntries(query: SmokeDiaryEntriesQuery): Promise<SmokeDiaryEntry[]> {
    const { userId, startDateTime, endDateTime } = query;
    const params: SmokeDiaryEntriesRequestQuery = {
      userId,
      startUtcDateTime: startDateTime.toISOString(),
      endUtcDateTime: endDateTime.toISOString(),
    };

    const responseItems = await this.httpClient
      .get(`${this.smokeDiaryUrl}/entries`, { params: params as any })
      .toPromise() as SmokeDiaryEntryResponse[];

    const smokeDiaryEntries = responseItems.map((responseItem): SmokeDiaryEntry => ({
      id: responseItem.id,
      userId: responseItem.userId,
      dateTime: this.dateService.toDate(responseItem.utcDateTime),
    }));

    return smokeDiaryEntries;
  }

  async getNumberOfSmokeDiaryEntries(query: SmokeDiaryEntriesQuery): Promise<number> {
    const { userId, startDateTime, endDateTime } = query;
    const params: SmokeDiaryEntriesRequestQuery = {
      userId,
      startUtcDateTime: startDateTime.toISOString(),
      endUtcDateTime: endDateTime.toISOString(),
    };

    const { numberOfSmokeDiaryEntries } = await this.httpClient
      .get(`${this.smokeDiaryUrl}/entries/count`, { params: params as any })
      .toPromise() as NumberOfSmokeDiaryEntriesResponse;
    return numberOfSmokeDiaryEntries;
  }

  async getAverageTimeBetweenSmokeDiaryEntries(query: SmokeDiaryEntriesQuery): Promise<AverageTimeBetweenSmokeDiaryEntriesResponse> {
    const { userId, startDateTime, endDateTime } = query;
    const params: SmokeDiaryEntriesRequestQuery = {
      userId,
      startUtcDateTime: startDateTime.toISOString(),
      endUtcDateTime: endDateTime.toISOString(),
    };

    const response = await this.httpClient
      .get(`${this.smokeDiaryUrl}/entries/average-time-between`, { params: params as any })
      .toPromise() as AverageTimeBetweenSmokeDiaryEntriesResponse;
    return response;
  }

  async getLatestSmokeDiaryEntry(userId: string): Promise<SmokeDiaryEntry | null> {
    const smokeDiaryEntryResponse = await this.httpClient
      .get(`${this.smokeDiaryUrl}/entries/latest`, { params: { userId } })
      .toPromise() as SmokeDiaryEntryResponse;

    if (!smokeDiaryEntryResponse) {
      return null;
    }

    return {
      id: smokeDiaryEntryResponse.id,
      userId: smokeDiaryEntryResponse.userId,
      dateTime: this.dateService.toDate(smokeDiaryEntryResponse.utcDateTime),
    };
  }
}
