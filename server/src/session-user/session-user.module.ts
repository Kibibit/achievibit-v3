import { Module } from '@nestjs/common';

import { RepositoriesModule } from '@kb-repositories';
import { ShieldsModule } from '@kb-shields';
import { UsersModule } from '@kb-users';

import { SystemsModule } from '../systems/systems.module';
import { SessionUserController } from './session-user.controller';
import { SessionUserService } from './session-user.service';
import { EventsModule } from '@kb-events';

@Module({
  imports: [
    SystemsModule,
    UsersModule,
    RepositoriesModule,
    ShieldsModule,
    EventsModule
  ],
  controllers: [ SessionUserController ],
  providers: [ SessionUserService ]
})
export class SessionUserModule {}
