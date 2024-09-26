import { Module } from '@nestjs/common';

import { ShieldsModule } from '@kb-shields';

import { SessionUserController } from './session-user.controller';
import { SessionUserService } from './session-user.service';

@Module({
  imports: [
    ShieldsModule
  ],
  controllers: [ SessionUserController ],
  providers: [ SessionUserService ]
})
export class SessionUserModule {}
