import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { configService } from '@kb-config';
import { DisableInProduction } from '@kb-decorators';
import { BitbucketWebhookGuard, GitHubWebhookGuard, GitLabWebhookGuard } from '@kb-guards';

import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService
  ) {}

  @Post('bitbucket')
  @ApiOperation({ summary: 'Endpoint for Bitbucket webhooks' })
  @UseGuards(BitbucketWebhookGuard)
  @ApiSecurity('bitbucket-webhook')
  @ApiBody({
    schema: {
      type: 'object'
    }
  })
  bitbucket(
    @Body() body: any
  ) {
    return this.webhooksService.handleBitBucketWebhook(body);
  }

  @Post('github')
  @ApiOperation({ summary: 'Endpoint for GitHub webhooks' })
  @UseGuards(GitHubWebhookGuard)
  @ApiSecurity('github-webhook')
  @ApiBody({
    schema: {
      type: 'object'
    }
  })
  github(
    @Body() body: any
  ) {
    return this.webhooksService.handleGitHubWebhook(body);
  }

  @Post('gitlab')
  @ApiOperation({ summary: 'Endpoint for GitLab webhooks' })
  @UseGuards(GitLabWebhookGuard)
  @ApiSecurity('gitlab-webhook')
  @ApiBody({
    schema: {
      type: 'object'
    }
  })
  gitlab(
    @Body() body: any
  ) {
    return this.webhooksService.handleGitLabWebhook(body);
  }

  @Post('bitbucket/generate-token')
  @ApiOperation({ summary: 'Generate a BitBucket token for testing' })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  @ApiBody({ schema: { type: 'object' } })
  generateBitBucketTokenDev(
    @Body() body: any
  ) {
    return this.webhooksService.generateBitBucketWebhookApiToken(body);
  }

  @Post('github/generate-token')
  @ApiOperation({ summary: 'Generate a GitHub token for testing' })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  @ApiBody({ schema: { type: 'object' } })
  generateGitHubTokenDev(
    @Body() body: any
  ) {
    return this.webhooksService.generateGitHubWebhookApiToken(body);
  }

  @Post('gitlab/generate-token')
  @ApiOperation({ summary: 'Generate a GitLab token for testing' })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  generateGitLabTokenDev() {
    return this.webhooksService.generateGitLabWebhookApiToken();
  }
}
