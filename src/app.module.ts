import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService, SmeeService } from '@kb-config';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production',
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SmeeService
  ],
})
export class AppModule {}
