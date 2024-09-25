import { Module } from '@nestjs/common';

import { UsersModule } from '@kb-users';

import { BitbucketModule } from './bitbucket/bitbucket.module';
import { BitBucketStrategy } from './bitbucket/bitbucket.strategy';
import { GithubModule } from './github/github.module';
import { GitHubStrategy } from './github/github.strategy';
import { GitlabModule } from './gitlab/gitlab.module';
import { GitLabStrategy } from './gitlab/gitlab.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    GithubModule,
    GitlabModule,
    BitbucketModule
  ],
  providers: [
    // Strategies
    JwtStrategy,
    GitHubStrategy,
    GitLabStrategy,
    BitBucketStrategy
    // Services
    // AuthService
  ],
  controllers: [ AuthController ]
})
export class AuthModule {}
