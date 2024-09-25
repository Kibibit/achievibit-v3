import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@kb-auth';
import { configService, SmeeService } from '@kb-config';
import { UsersModule } from '@kb-users';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production'
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: configService.config.MONGO_URL,
      database: configService.config.MONGO_DB_NAME,
      entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
      ssl: false
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [ AppController ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    AppService,
    SmeeService
  ]
})
export class AppModule {}
