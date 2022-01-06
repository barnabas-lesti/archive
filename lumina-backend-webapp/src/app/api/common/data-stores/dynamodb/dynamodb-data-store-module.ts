import { Module } from '@nestjs/common';

import { DynamoDbDataStore } from './dynamodb-data-store';
import { dynamoDbDocumentClientFactory } from './dynamodb-document-client-factory';

const dynamoDbDocumentClientProvider = {
  provide: DynamoDbDataStore,
  useFactory: dynamoDbDocumentClientFactory,
};

@Module({
  exports: [dynamoDbDocumentClientProvider],
  providers: [dynamoDbDocumentClientProvider],
})
export class DynamoDbDataStoreModule {}
