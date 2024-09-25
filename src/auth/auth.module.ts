import { Module } from '@nestjs/common';

import { UsersModule } from '@kb-users';

import { BitbucketModule } from './bitbucket/bitbucket.module';
import { GithubModule } from './github/github.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    GithubModule,
    GitlabModule,
    BitbucketModule
  ],
  controllers: [ AuthController ]
})
export class AuthModule {}
