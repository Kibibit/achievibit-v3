import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { configService, Logger } from '@kb-config';

import { GitHubEvent } from './engines/github.event';

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
    const event = new GitHubEvent(eventType, body);
    if (event.isInstallationCreated) {
      this.logger.debug('GitHub App installation created');
      return;
    }

    if (event.isInstallationDeleted) {
      this.logger.debug('GitHub App installation deleted');
      // return this.webhooksService.handleGitHubAppInstallationDeleted(body);
      return;
    }

    if (event.isInstallationRepositoriesAdded) {
      this.logger.debug('GitHub App installation repositories added');
      // return this.webhooksService.handleGitHubAppInstallationRepositories(body);
      return;
    }

    if (event.isInstallationRepositoriesRemoved) {
      this.logger.debug('GitHub App installation repositories removed');
      // return this.webhooksService.handleGitHubAppInstallationRepositoriesRemoved(body);
      return;
    }

    if (event.isPush) {
      this.logger.debug('GitHub push event');
      // return this.webhooksService.handleGitHubPush(body);
      return;
    }

    if (event.isPullRequest) {
      this.logger.debug('GitHub pull request event');
      // return this.webhooksService.handleGitHubPullRequest(body);
      return;
    }

    if (event.isPullRequestReview) {
      this.logger.debug('GitHub pull request review event');
      // return this.webhooksService.handleGitHubPullRequestReview(body);
      return;
    }

    if (event.isPullRequestReviewComment) {
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
