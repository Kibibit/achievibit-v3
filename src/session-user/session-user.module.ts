import { Module } from '@nestjs/common';

import { ShieldsModule } from '@kb-shields';
import { UsersModule } from '@kb-users';

import { SessionUserController } from './session-user.controller';
import { SessionUserService } from './session-user.service';

@Module({
  imports: [
    UsersModule,
    ShieldsModule
  ],
  controllers: [ SessionUserController ],
  providers: [ SessionUserService ]
})
export class SessionUserModule {}
