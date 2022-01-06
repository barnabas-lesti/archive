import { Module } from '@nestjs/common';

import { CommonApiModules } from '../../common';
import { SmokeDiaryModule } from './smoke-diary-module';
import { SmokeDiaryController } from './smoke-diary-controller';

@Module({
  imports: [
    CommonApiModules,

    SmokeDiaryModule,
  ],
  controllers: [SmokeDiaryController],
})
export class SmokeDiaryApiModule {}
