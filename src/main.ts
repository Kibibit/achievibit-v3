import { NestFactory } from '@nestjs/core';

import { configService } from '@kb-config';

import { AppModule } from './app.module';
import { Documentation } from './documentation';

bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { snapshot: true }
  );

  await Documentation.addDocumentation(app);

  await app.listen(configService.config.PORT);
}
