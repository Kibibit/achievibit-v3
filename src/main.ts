import { NestFactory } from '@nestjs/core';

import { configService } from '@kb-config';

import { AppModule } from './app.module';
import { Documentation } from './documentation';
import { Logger } from '@nestjs/common';

bootstrap();

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(
    AppModule,
    { snapshot: true }
  );

  await Documentation.addDocumentation(app);

  await app.listen(configService.config.PORT);

  const appUrl = (await app.getUrl()).replace(
    /\[.*?\]/,
    'localhost'
  );
  logger.log(`Application is running on: ${ appUrl }`);
}
