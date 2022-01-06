import * as dotenv from 'dotenv';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AddressInfo, Server } from 'net';

dotenv.config();

import { AppModule } from './app/app-module';
import { LoggerService } from './app/api/common/logger';

async function bootstrap(): Promise<Server> {
  const logger = new LoggerService(NestApplication.name);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const server: Server = await app.listen(process.env.PORT);
  const { address, port } = server.address() as AddressInfo;
  logger.log(`Nest application available at http://${address}:${port}`);
  return server;
}

export const server = bootstrap();
