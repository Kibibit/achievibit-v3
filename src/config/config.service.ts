/* eslint-disable no-process-env */
import { ConfigService, IConfigServiceOptions } from '@kibibit/configit';

import { AchievibitConfig } from './achievibit.config';

const ENV_DEFAULT = 'development';

const nodeEnv = process.env.NODE_ENV || ENV_DEFAULT;

export class KbConfigService extends ConfigService<AchievibitConfig> {
  logger: any;
  isDevelopmentMode = nodeEnv !== 'development';

  constructor(passedConfig?: Partial<AchievibitConfig>, options: IConfigServiceOptions = {}) {
    super(AchievibitConfig, passedConfig, {
      skipSchema: nodeEnv !== 'development',
      ...options
    });
  }
}

export const configService = new KbConfigService() as KbConfigService;
