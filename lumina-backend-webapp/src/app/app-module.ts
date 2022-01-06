import { Module } from '@nestjs/common';

import { HealthApiModule } from './api/health/health-api-module';

@Module({
  imports: [HealthApiModule],
})
export class AppModule {}
