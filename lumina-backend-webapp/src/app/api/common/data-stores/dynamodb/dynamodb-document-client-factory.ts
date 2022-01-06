import { DynamoDB } from 'aws-sdk';

import { DynamoDbDataStore } from './dynamodb-data-store';

const DEFAULT_AWS_REGION = process.env.DEFAULT_AWS_REGION;

export const dynamoDbDocumentClientFactory = (
  config: DynamoDB.ClientConfiguration = { region: DEFAULT_AWS_REGION },
) =>
  new DynamoDbDataStore({
    service: new DynamoDB(config),
  });
