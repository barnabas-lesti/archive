import { Injectable } from '@nestjs/common';

import { DynamoDbDataStore } from '../../common/data-stores';
import { SmokeDiaryEntriesQueryDto } from './dtos';
import { SmokeDiaryDateRangeException } from './exceptions';
import { SmokeDiaryEntry } from './interfaces';

export const TABLE_NAME = process.env.HEALTH_SMOKE_DIARY_ITEMS_TABLE_NAME;
export const USER_ID_DATE_TIME_INDEX_NAME = 'userId-utcDateTime-index';

@Injectable()
export class SmokeDiaryRepository {
  constructor(private readonly dynamoDbDataStore: DynamoDbDataStore) {}

  async createSmokeDiaryEntry(entry: SmokeDiaryEntry): Promise<SmokeDiaryEntry> {
    await this.dynamoDbDataStore
      .put({
        TableName: TABLE_NAME,
        Item: entry,
      })
      .promise();

    return entry;
  }

  async getSmokeDiaryEntries(query: SmokeDiaryEntriesQueryDto): Promise<SmokeDiaryEntry[]> {
    const { Items } = await this.executeDateRangeQuery(query);
    return Items as SmokeDiaryEntry[];
  }

  async getNumberOfSmokeDiaryEntries(query: SmokeDiaryEntriesQueryDto): Promise<number> {
    const { Count } = await this.executeDateRangeQuery(query, { count: true });
    return Count;
  }

  async getLatestSmokeDiaryEntry(userId: string): Promise<SmokeDiaryEntry> {
    const { Items: [ item ] } = await this.dynamoDbDataStore
      .query({
        TableName: TABLE_NAME,
        IndexName: USER_ID_DATE_TIME_INDEX_NAME,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames:{
          '#userId': 'userId',
        },
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        Limit: 1,
        ScanIndexForward: false,
      })
      .promise();

  return item as SmokeDiaryEntry;
  }

  private async executeDateRangeQuery(query: SmokeDiaryEntriesQueryDto, { count = false } = {}) {
    const { userId, startUtcDateTime, endUtcDateTime } = query;

    try {
      const queryResult = await this.dynamoDbDataStore
        .query({
          TableName: TABLE_NAME,
          IndexName: USER_ID_DATE_TIME_INDEX_NAME,
          KeyConditionExpression: '#userId = :userId and #utcDateTime between :startUtcDateTime and :endUtcDateTime',
          ExpressionAttributeNames:{
            '#userId': 'userId',
            '#utcDateTime': 'utcDateTime',
          },
          ExpressionAttributeValues: {
            ':userId': userId,
            ':startUtcDateTime': startUtcDateTime,
            ':endUtcDateTime': endUtcDateTime,
          },
          ...(count ? { Select: 'COUNT' } : {}),
        })
        .promise();

      return queryResult;
    } catch (exception) {
      if (
        exception.code === 'ValidationException' &&
        exception.message.indexOf('upper bound to be greater than or equal to lower bound') != -1
      ) {
        throw new SmokeDiaryDateRangeException(endUtcDateTime);
      }

      throw exception;
    }
  }
}
