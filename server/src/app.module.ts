import { join } from 'path';

import { ClassSerializerInterceptor, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@kb-auth';
import { configService, SmeeService } from '@kb-config';
import { EventsModule } from '@kb-events';
import { DbExceptionFilter } from '@kb-filters';
import { DisableInProductionGuard } from '@kb-guards';
import { HealthModule } from '@kb-health';
import { LoggerMiddleware } from '@kb-middleware';
import { OrganizationsModule } from '@kb-organizations';
import { PullRequestsModule } from '@kb-pull-requests';
import { RepositoriesModule } from '@kb-repositories';
import { SessionUserModule } from '@kb-session-user';
import { ShieldsModule } from '@kb-shields';
import { SystemsModule } from '@kb-systems';
import { TasksModule } from '@kb-tasks';
import { UsersModule } from '@kb-users';
import { WebhooksModule } from '@kb-webhooks';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    PrometheusModule.register({
      path: "/api/metrics",
      defaultLabels: {
        app: "achievibit-v3"
      }
    }),
    DevtoolsModule.register({
      http: configService.config.NODE_ENV !== 'production'
    }),
    ServeStaticModule.forRoot({
      // Adjust the path to your client build directory
      rootPath: join(configService.appRoot, 'client'),
      // Exclude API routes
      exclude: [ '/api*', '/login*', '/socket.io*' ]
    }),
    ThrottlerModule.forRoot([ {
      ttl: 60000,
      limit: 25
    } ]),
    TypeOrmModule.forRoot(configService.getTypeOrmPostgresConfig()),
    AuthModule,
    UsersModule,
    SessionUserModule,
    RepositoriesModule,
    PullRequestsModule,
    OrganizationsModule,
    WebhooksModule,
    ShieldsModule,
    HealthModule,
    SystemsModule,
    TasksModule,
    EventsModule
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
    {
      provide: APP_FILTER,
      useClass: DbExceptionFilter
    },
    AppService,
    SmeeService
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
