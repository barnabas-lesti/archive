import { DynamoDB } from 'aws-sdk';

export class DynamoDbDataStore extends DynamoDB.DocumentClient {}
