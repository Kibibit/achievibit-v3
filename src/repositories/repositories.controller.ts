import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PageOptionsModel } from '@kb-models';

import { RepositoriesService } from './repositories.service';

@Controller('repos')
@ApiTags('Repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all repositories',
    description: 'Returns a paginated list of all repositories'
  })
  async getRepos(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.repositoriesService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get repository by id',
    description: 'Returns a repository by its id'
  })
  async getRepo(
    @Query('id') id: string
  ) {
    return await this.repositoriesService.findById(id);
  }
}
