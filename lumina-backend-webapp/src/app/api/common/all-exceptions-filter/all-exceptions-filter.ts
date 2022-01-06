import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import {
  InvalidRequestException,
  RequestError,
} from '../validation';
import { LoggerService } from '../logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      'getStatus' in exception
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception.stack);
    }

    response.status(status);

    if (exception instanceof InvalidRequestException) {
      const requestErrors = exception.getResponse() as RequestError[];
      response.json(requestErrors);
    }

    response.send();
  }
}
