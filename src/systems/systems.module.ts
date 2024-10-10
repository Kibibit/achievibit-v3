import { Module } from '@nestjs/common';

import { UsersModule } from '@kb-users';

import { BitbucketService } from './bitbucket/bitbucket.service';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { RepositoriesModule } from '@kb-repositories';

@Module({
  imports: [
    UsersModule,
    RepositoriesModule
  ],
  providers: [ GithubService, GitlabService, BitbucketService ],
  exports: [ GithubService, GitlabService, BitbucketService ]
})
export class SystemsModule {}
