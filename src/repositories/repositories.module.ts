import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';

@Module({
  providers: [RepositoriesService],
  controllers: [RepositoriesController]
})
export class RepositoriesModule {}
