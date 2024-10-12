import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PullRequest } from '@kb-models';

import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ PullRequest ])
  ],
  providers: [ PullRequestsService ],
  controllers: [ PullRequestsController ]
})
export class PullRequestsModule {}
