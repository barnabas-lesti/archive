import { Module } from '@nestjs/common';

import { AllExceptionsModule } from './all-exceptions-filter';
import { CommonValidationModule } from './validation';

@Module({
  imports: [
    AllExceptionsModule,
    CommonValidationModule,
  ],
})
export class CommonApiModules {}
