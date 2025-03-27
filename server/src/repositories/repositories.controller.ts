import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@kb-decorators';
import { PageOptionsModel, Repository } from '@kb-models';

import { RepositoriesService } from './repositories.service';
import { ILike } from 'typeorm';

@Controller('api/repos')
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
  @ApiOkResponsePaginated(Repository)
  async getRepos(
    @Query() pageOptions: PageOptionsModel
  ) {
    if (pageOptions.query) {
      return await this.repositoriesService.findAll(pageOptions, {
        name: ILike(`%${pageOptions.query}%`)
      });
    }

    return await this.repositoriesService.findAll(pageOptions);
  }

  @Get(':owner/:name')
  @ApiOperation({
    summary: 'Get repository by fullname',
    description: 'Returns a repository by its fullname'
  })
  @ApiOkResponse({
    type: Repository
  })
  async getRepo(
    @Param('owner') owner: string,
    @Param('name') name: string
  ) {
    return await this.repositoriesService.findByFullname(owner, name);
  }
}
