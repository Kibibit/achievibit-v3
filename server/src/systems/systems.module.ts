import { Module } from '@nestjs/common';

import { RepositoriesModule } from '@kb-repositories';
import { UsersModule } from '@kb-users';

import { BitbucketService } from './bitbucket/bitbucket.service';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { OrganizationsModule } from '@kb-organizations';

@Module({
  imports: [
    UsersModule,
    RepositoriesModule,
    OrganizationsModule
  ],
  providers: [ GithubService, GitlabService, BitbucketService ],
  exports: [ GithubService, GitlabService, BitbucketService ]
})
export class SystemsModule {}
