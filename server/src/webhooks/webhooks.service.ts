import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { configService } from '@kb-config';

@Injectable()
export class WebhooksService {
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
    console.log('BitBucket webhook received');

    return {
      message: 'Webhook received'
    };
  }

  handleGitHubWebhook(body: any) {
    console.log('GitHub webhook received');

    return {
      message: 'Webhook received'
    };
  }

  handleGitLabWebhook(body: any) {
    console.log('GitLab webhook received');

    return {
      message: 'Webhook received'
    };
  }
}
