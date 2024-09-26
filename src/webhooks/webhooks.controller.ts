import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { BitbucketWebhookGuard, GitHubWebhookGuard, GitLabWebhookGuard } from '@kb-guards';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhooksController {
  @Post('bitbucket')
  @ApiOperation({ summary: 'Endpoint for Bitbucket webhooks' })
  @UseGuards(BitbucketWebhookGuard)
  @ApiSecurity('bitbucket-webhook')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        test: { type: 'string' }
      }
    }
  })
  bitbucket(
    @Body() body: any
  ) {
    return 'Bitbucket webhook received';
  }

  @Post('github')
  @ApiOperation({ summary: 'Endpoint for GitHub webhooks' })
  @UseGuards(GitHubWebhookGuard)
  @ApiSecurity('github-webhook')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        test: { type: 'string' }
      }
    }
  })
  github(
    @Body() body: any
  ) {
    return 'GitHub webhook received';
  }

  @Post('gitlab')
  @ApiOperation({ summary: 'Endpoint for GitLab webhooks' })
  @UseGuards(GitLabWebhookGuard)
  @ApiSecurity('gitlab-webhook')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        test: { type: 'string' }
      }
    }
  })
  gitlab(
    @Body() body: any
  ) {
    return 'GitLab webhook received';
  }
}
