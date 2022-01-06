import { Module } from '@nestjs/common';

import { DynamoDbDataStoreModule } from '../../common/data-stores';
import { SmokeDiaryRepository } from './smoke-diary-repository';
import { SmokeDiaryService } from './smoke-diary-service';

@Module({
  imports: [DynamoDbDataStoreModule],
  exports: [SmokeDiaryService],
  providers: [
    SmokeDiaryRepository,
    SmokeDiaryService,
  ],
})
export class SmokeDiaryModule {}
