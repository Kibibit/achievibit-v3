import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@kb-users';

import { JwtModule } from '../jwt/jwt.module';
import { GitlabController } from './gitlab.controller';
import { GitLabStrategy } from './gitlab.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    UsersModule
  ],
  providers: [
    GitLabStrategy
  ],
  controllers: [ GitlabController ]
})
export class GitlabModule {}
