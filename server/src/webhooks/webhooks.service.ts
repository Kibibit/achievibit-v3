import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { configService, Logger } from '@kb-config';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  generateBitBucketWebhookApiToken(body: any) {
    const bodyString = JSON.stringify(body);

    // Generate a valid HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', configService.config.BITBUCKET_WEBHOOK_SECRET);
    const digest = hmac.update(bodyString).digest('hex');

    return digest;
  }

  generateGitHubWebhookApiToken(body: any) {
    const bodyString = JSON.stringify(body);

    // Generate a valid HMAC-SHA256 signature for GitHub
    const hmac = crypto.createHmac('sha256', configService.config.GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(bodyString).digest('hex');

    return digest;
  }

  generateGitLabWebhookApiToken() {
    return configService.config.GITLAB_WEBHOOK_SECRET;
  }

  handleBitBucketWebhook(body: any) {
    return {
      message: 'Webhook received'
    };
  }

  handleGitHubWebhook(
    eventType: string,
    body: Record<string, any>
  ) {
    // event type: https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads
    if (eventType === 'installation' && body.action === 'created') {
      this.logger.debug('GitHub App installation created');
      return;
    }

    if (eventType === 'installation' && body.action === 'deleted') {
      this.logger.debug('GitHub App installation deleted');
      // return this.webhooksService.handleGitHubAppInstallationDeleted(body);
      return;
    }

    if (eventType === 'installation_repositories' && body.action === 'added') {
      this.logger.debug('GitHub App installation repositories added');
      // return this.webhooksService.handleGitHubAppInstallationRepositories(body);
      return;
    }

    if (eventType === 'installation_repositories' && body.action === 'removed') {
      this.logger.debug('GitHub App installation repositories removed');
      // return this.webhooksService.handleGitHubAppInstallationRepositoriesRemoved(body);
      return;
    }

    if (eventType === 'push') {
      this.logger.debug('GitHub push event');
      // return this.webhooksService.handleGitHubPush(body);
      return;
    }

    if (eventType === 'pull_request') {
      this.logger.debug('GitHub pull request event');
      // return this.webhooksService.handleGitHubPullRequest(body);
      return;
    }

    if (eventType === 'pull_request_review') {
      this.logger.debug('GitHub pull request review event');
      // return this.webhooksService.handleGitHubPullRequestReview(body);
      return;
    }

    if (eventType === 'pull_request_review_comment') {
      this.logger.debug('GitHub pull request review comment event');
      // return this.webhooksService.handleGitHubPullRequestReviewComment(body);
      return;
    }

    this.logger.debug('GitHub event not handled', {
      eventType,
      action: body.action
    });
  }

  handleGitLabWebhook(body: any) {
    return {
      message: 'Webhook received'
    };
  }
}
