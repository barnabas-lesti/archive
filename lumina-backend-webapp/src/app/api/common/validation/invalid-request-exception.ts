import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { RequestError } from './request-error';

export class InvalidRequestException extends HttpException {
  constructor(
    requestErrors: RequestError[],
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(requestErrors, status);
  }
}
