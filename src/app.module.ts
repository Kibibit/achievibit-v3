import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { configService, SmeeService } from '@kb-config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@kb-auth';
import { UsersModule } from '@kb-users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';

@Module({
  imports: [
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production'
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    SmeeService
  ]
})
export class AppModule {}
