import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { configService } from '@kb-config';

import { AppModule } from './app.module';
import { Documentation } from './documentation';

bootstrap();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { snapshot: true }
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.disable('x-powered-by');

  await Documentation.addDocumentation(app);

  await app.listen(configService.config.PORT);

  const appUrl = (await app.getUrl()).replace(
    /\[.*?\]/,
    'localhost'
  );
  logger.log(`Application is running on: ${ appUrl }`);
  logger.log(`Running in ${ configService.config.NODE_ENV } mode`);
}
