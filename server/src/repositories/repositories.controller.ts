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

  @Get('test-openai')
  @ApiOperation({
    summary: 'Test OpenAI',
    description: 'Test OpenAI API'
  })
  @ApiOkResponse({
    type: String
  })
  async testOpenAI() {
    const repoName = 'joe-pizza-online-orders';
    const description = 'A pizza ordering system for Joe\'s Pizza. The best pizza in New York City!';
    const languages = ['JavaScript', 'TypeScript'];

    const avatarBase64 = await this.repositoriesService.generateAvatar(repoName, description, languages);

    // serve it
    return `data:image/png;base64,${avatarBase64}`;
  }
}
