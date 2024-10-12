/* eslint-disable no-process-env */
import { join } from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService, IConfigServiceOptions } from '@kibibit/configit';

import { AchievibitConfig } from './achievibit.config';
import { Logger } from './logger/logger';

const ENV_DEFAULT = 'development';

const nodeEnv = process.env.NODE_ENV || ENV_DEFAULT;

export class KbConfigService extends ConfigService<AchievibitConfig> {
  logger = new Logger('ConfigService');
  isDevelopmentMode = this.config.NODE_ENV !== 'development';
  isProductionMode = this.config.NODE_ENV === 'production';

  constructor(passedConfig?: Partial<AchievibitConfig>, options: IConfigServiceOptions = {}) {
    super(AchievibitConfig, passedConfig, {
      skipSchema: ![
        'development',
        'devcontainer'
      ].includes(nodeEnv),
      ...options
    });
  }

  public getTypeOrmPostgresConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      // name: 'postgres',

      host: this.config.POSTGRES_HOST,
      port: this.config.POSTGRES_PORT,
      username: this.config.POSTGRES_USER,
      password: this.config.POSTGRES_PASSWORD,
      database: this.config.POSTGRES_DATABASE,

      entities: [ '**/*.entity{.ts,.js}' ],

      migrationsTableName: 'migration',

      migrations: [ join(this.appRoot, 'src', 'migrations', '*.{ts,js}') ],

      // cli: {
      //   migrationsDir: 'src/migration'
      // },

      ssl: this.isProductionMode,

      synchronize: this.config.SYNCHRONIZE_DATABASE
      // logging: true
    };
  }

  public isGithubOauthConfigured() {
    return this.config.GITHUB_CLIENT_ID &&
      this.config.GITHUB_CLIENT_SECRET &&
      this.config.GITHUB_CALLBACK_URL;
  }

  public isGitlabOauthConfigured() {
    return this.config.GITLAB_CLIENT_ID &&
      this.config.GITLAB_CLIENT_SECRET &&
      this.config.GITLAB_CALLBACK_URL;
  }

  public isBitbucketOauthConfigured() {
    return this.config.BITBUCKET_CLIENT_ID &&
      this.config.BITBUCKET_CLIENT_SECRET &&
      this.config.BITBUCKET_CALLBACK_URL;
  }

  public isNoOauthConfigured() {
    return !this.isGithubOauthConfigured() &&
      !this.isGitlabOauthConfigured() &&
      !this.isBitbucketOauthConfigured();
  }
}

export const configService = new KbConfigService();
