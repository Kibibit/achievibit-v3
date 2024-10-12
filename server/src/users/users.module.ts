import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Integration, User } from '@kb-models';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Integration ])
  ],
  providers: [ UsersService ],
  controllers: [ UsersController ],
  exports: [ UsersService ]
})
export class UsersModule {}
