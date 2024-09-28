import { ClassSerializerInterceptor, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@kb-auth';
import { configService, SmeeService } from '@kb-config';
import { DisableInProductionGuard } from '@kb-guards';
import { OrganizationsModule } from '@kb-organizations';
import { PullRequestsModule } from '@kb-pull-requests';
import { RepositoriesModule } from '@kb-repositories';
import { SessionUserModule } from '@kb-session-user';
import { ShieldsModule } from '@kb-shields';
import { UsersModule } from '@kb-users';
import { WebhooksModule } from '@kb-webhooks';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(configService.appRoot, 'client'), // Adjust the path to your client build directory
      exclude: ['/api*'], // Exclude API routes
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmPostgresConfig()),
    AuthModule,
    UsersModule,
    SessionUserModule,
    RepositoriesModule,
    PullRequestsModule,
    OrganizationsModule,
    WebhooksModule,
    ShieldsModule
  ],
  controllers: [ AppController ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: DisableInProductionGuard
    },
    AppService,
    SmeeService
  ]
})
export class AppModule {}
