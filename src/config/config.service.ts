/* eslint-disable no-process-env */
import * as crypto from 'crypto';

import { ConfigService, IConfigServiceOptions } from '@kibibit/configit';

import { AchievibitConfig } from './achievibit.config';

const ENV_DEFAULT = 'development';

const nodeEnv = process.env.NODE_ENV || ENV_DEFAULT;

export class KbConfigService extends ConfigService<AchievibitConfig> {
  logger: any;

  constructor(passedConfig?: Partial<AchievibitConfig>, options: IConfigServiceOptions = {}) {
    super(AchievibitConfig, passedConfig, {
      skipSchema: nodeEnv !== 'development',
      ...options
    });
  }

  private generateBitBucketWebhookApiToken(body: any) {
    const bodyString = JSON.stringify(body);

    // Generate a valid HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', this.config.BITBUCKET_WEBHOOK_SECRET);
    const digest = hmac.update(bodyString).digest('hex');

    return digest;
  }

  private generateGitHubWebhookApiToken(body: any) {
    const bodyString = JSON.stringify(body);

    // Generate a valid HMAC-SHA256 signature for GitHub
    const hmac = crypto.createHmac('sha256', this.config.GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(bodyString).digest('hex');

    return digest;
  }

  private generateGitLabWebhookApiToken() {
    return this.config.GITLAB_WEBHOOK_SECRET;
  }
}

export const configService = new KbConfigService() as KbConfigService;
