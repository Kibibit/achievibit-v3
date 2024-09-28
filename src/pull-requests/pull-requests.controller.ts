import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

import { configService } from '@kb-config';
import { ApiOkResponsePaginated, DisableInProduction } from '@kb-decorators';
import { JwtAuthGuard } from '@kb-guards';
import { PageOptionsModel, PullRequest } from '@kb-models';

import { PullRequestsService } from './pull-requests.service';

@Controller('api/prs')
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
  @ApiCookieAuth()
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  @ApiOkResponsePaginated(PullRequest)
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
  @ApiCookieAuth()
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  async getPullRequestDev(
    @Query('id') id: string
  ) {
    return await this.pullRequestsService.findById(id);
  }

  @Get('mock')
  @ApiOperation({
    summary: 'Create a mock pull request',
    description: 'Creates a mock pull request'
  })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  async createMockPullRequestDev() {
    return await this.pullRequestsService.createMock();
  }
}
