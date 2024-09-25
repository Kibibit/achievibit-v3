import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@kb-users';

import { JwtModule } from '../jwt/jwt.module';
import { BitbucketController } from './bitbucket.controller';
import { BitBucketStrategy } from './bitbucket.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    UsersModule
  ],
  providers: [
    BitBucketStrategy
  ],
  controllers: [ BitbucketController ]
})
export class BitbucketModule {}
