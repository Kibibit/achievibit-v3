import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

import { configService } from '@kb-config';
import { JwtAuthGuard } from '@kb-guards';
import { PageOptionsModel } from '@kb-models';

import { PullRequestsService } from './pull-requests.service';

@Controller('prs')
@ApiTags('Pull Requests')
export class PullRequestsController {
  constructor(
    private readonly pullRequestsService: PullRequestsService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all pull requests',
    description: 'Returns a paginated list of all pull requests'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  async getPullRequestsDev(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.pullRequestsService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a pull request by id',
    description: 'Returns a pull requests by its id'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  async getPullRequestDev(
    @Query('id') id: string
  ) {
    return await this.pullRequestsService.findById(id);
  }
}
