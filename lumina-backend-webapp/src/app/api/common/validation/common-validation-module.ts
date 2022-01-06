import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { CommonValidationPipe } from './common-validation-pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new CommonValidationPipe(),
    },
  ],
})
export class CommonValidationModule {}
