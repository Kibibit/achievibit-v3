import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
    summary: 'Get all repositories',
    description: 'Returns a paginated list of all pull requests'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPullRequests(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.pullRequestsService.findAll(pageOptions);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get repository by id',
    description: 'Returns a pull requests by its id'
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPullRequest(
    @Query('id') id: string
  ) {
    return await this.pullRequestsService.findById(id);
  }
}
