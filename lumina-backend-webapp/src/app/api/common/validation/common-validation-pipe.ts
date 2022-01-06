import { ValidatorOptions } from 'class-validator';
import {
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { InvalidRequestException } from './invalid-request-exception';
import { RequestError } from './request-error';

const validatorOptions: ValidatorOptions = {
  forbidUnknownValues: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};

const toRequestErrors = (validationErrors: ValidationError[]): RequestError[] =>
  validationErrors.flatMap((validationError: ValidationError) =>
    Object.entries(validationError.constraints).map(
      ([type, message]: [string, string]): RequestError => ({
        type,
        message,
        path: validationError.property,
        invalidValue: validationError.value,
      }),
    ),
  );

@Injectable()
export class CommonValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const requestErrors = toRequestErrors(validationErrors);
        throw new InvalidRequestException(requestErrors);
      },
      ...validatorOptions,
    });
  }
}
