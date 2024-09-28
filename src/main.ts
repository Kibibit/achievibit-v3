import { join } from 'path';

import { magenta } from 'colors';
import cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { configService, loggerInstance } from '@kb-config';

import { AppModule } from './app.module';
import { Documentation } from './documentation';

import 'reflect-metadata';

bootstrap();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      snapshot: true,
      logger: WinstonModule.createLogger({
        instance: loggerInstance
      })
    }
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.disable('x-powered-by');
  app.use(cookieParser());

  app.useStaticAssets(join(configService.appRoot, 'client'), {
    // Cache static assets for 1 day
    maxAge: configService.isDevelopmentMode ? 0 : '1d'
  });

  await Documentation.addDocumentation(app);

  await app.listen(configService.config.PORT);

  const appUrl = (await app.getUrl()).replace(
    /\[.*?\]/,
    'localhost'
  );
  logger.log(`Application is running on: ${ magenta(appUrl) }`);
  logger.log(`Running in ${ magenta(configService.config.NODE_ENV) } mode`);
}
