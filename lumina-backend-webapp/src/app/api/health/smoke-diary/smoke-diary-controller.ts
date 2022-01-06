import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import {
  CreateSmokeDiaryEntryBodyDto,
  LatestSmokeDiaryEntryQueryDto,
  SmokeDiaryEntriesQueryDto,
} from './dtos';
import {
  AverageTimeBetweenSmokeDiaryEntriesResponse,
  NumberOfSmokeDiaryEntriesResponse,
  SmokeDiaryEntry,
} from './interfaces';
import { SmokeDiaryService } from './smoke-diary-service';

@Controller('/health/smoke-diary')
export class SmokeDiaryController {
  constructor(private readonly smokeDiaryService: SmokeDiaryService) {}

  @Post('/entries')
  async createSmokeDiaryEntry(@Body() body: CreateSmokeDiaryEntryBodyDto): Promise<SmokeDiaryEntry> {
    return await this.smokeDiaryService.createSmokeDiaryEntry(body);
  }

  @Get('/entries')
  async getSmokeDiaryEntries(@Query() query: SmokeDiaryEntriesQueryDto): Promise<SmokeDiaryEntry[]> {
    return await this.smokeDiaryService.getSmokeDiaryEntries(query);
  }

  @Get('/entries/count')
  async getNumberOfSmokeDiaryEntries(@Query() query: SmokeDiaryEntriesQueryDto): Promise<NumberOfSmokeDiaryEntriesResponse> {
    const numberOfSmokeDiaryEntries = await this.smokeDiaryService.getNumberOfSmokeDiaryEntries(query);
    return { numberOfSmokeDiaryEntries };
  }

  @Get('/entries/average-time-between')
  async getAverageTimeBetweenSmokeDiaryEntries(@Query() query: SmokeDiaryEntriesQueryDto): Promise<AverageTimeBetweenSmokeDiaryEntriesResponse> {
    const averageTimeInMs = await this.smokeDiaryService.getAverageTimeBetweenSmokeDiaryEntriesInMs(query);
    return { averageTimeInMs };
  }

  @Get('/entries/latest')
  async getLatestSmokeDiaryEntry(@Query() query: LatestSmokeDiaryEntryQueryDto): Promise<SmokeDiaryEntry> {
    return await this.smokeDiaryService.getLatestSmokeDiaryEntry(query.userId);
  }
}
