import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { configService, SmeeService } from '@kb-config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production'
    })
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    SmeeService
  ]
})
export class AppModule {}
