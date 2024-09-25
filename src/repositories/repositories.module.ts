import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from '@kb-models';

import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Repository ])
  ],
  providers: [ RepositoriesService ],
  controllers: [ RepositoriesController ]
})
export class RepositoriesModule {}
