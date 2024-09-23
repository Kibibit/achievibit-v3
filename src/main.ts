import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from '@kb-config';
import { setupDocumentation } from './documentation';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { snapshot: true }
  );

  await setupDocumentation(app);

  await app.listen(configService.config.PORT);
}
bootstrap();
