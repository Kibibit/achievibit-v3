import { Module } from '@nestjs/common';

import { UsersModule } from '@kb-users';

import { BitbucketModule } from './bitbucket/bitbucket.module';
import { GithubModule } from './github/github.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { AuthController } from './auth.controller';
import { configService, Logger } from '@kb-config';

const logger = new Logger('AuthModule');

const imports = [ UsersModule ];

if (configService.isNoOauthConfigured()) {
  logger.error([
    '\nNo OAuth providers are configured.',
    'Please configure at least one OAuth provider.'
  ].join('\n'));
  process.exit(1);
}

if (configService.isGithubOauthConfigured()) {
  imports.push(GithubModule);
}

if (configService.isGitlabOauthConfigured()) {
  imports.push(GitlabModule);
}

if (configService.isBitbucketOauthConfigured()) {
  imports.push(BitbucketModule);
}

@Module({
  imports,
  controllers: [ AuthController ]
})
export class AuthModule {}
