import { join } from 'path';

import { ClassSerializerInterceptor, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@kb-auth';
import { configService, SmeeService } from '@kb-config';
import { DbExceptionFilter } from '@kb-filters';
import { DisableInProductionGuard } from '@kb-guards';
import { LoggerMiddleware } from '@kb-middleware';
import { OrganizationsModule } from '@kb-organizations';
import { PullRequestsModule } from '@kb-pull-requests';
import { RepositoriesModule } from '@kb-repositories';
import { SessionUserModule } from '@kb-session-user';
import { ShieldsModule } from '@kb-shields';
import { UsersModule } from '@kb-users';
import { WebhooksModule } from '@kb-webhooks';

import { EventsGateway } from './events/events.gateway';
import { HealthModule } from './health/health.module';
import { SystemsModule } from './systems/systems.module';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { GrowthbookService } from './growthbook/growthbook.service';

@Module({
  imports: [
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
    SmeeService,
    GrowthbookService
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
