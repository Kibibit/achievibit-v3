import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@kb-users';

import { JwtModule } from '../jwt/jwt.module';
import { GithubController } from './github.controller';
import { GitHubStrategy } from './github.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    UsersModule
  ],
  providers: [
    GitHubStrategy
  ],
  controllers: [ GithubController ]
})
export class GithubModule {}
