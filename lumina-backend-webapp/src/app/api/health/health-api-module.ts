import { Module } from '@nestjs/common';

import { SmokeDiaryApiModule } from './smoke-diary/smoke-diary-api-module';

@Module({
  imports: [SmokeDiaryApiModule],
})
export class HealthApiModule {}
