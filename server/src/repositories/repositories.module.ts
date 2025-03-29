import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Repository } from '@kb-models';

import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    OpenaiModule,
    TypeOrmModule.forFeature([ Repository ])
  ],
  providers: [ RepositoriesService ],
  controllers: [ RepositoriesController ],
  exports: [ RepositoriesService ]
})
export class RepositoriesModule {}
