import { IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseConfig, Configuration, ConfigVariable } from '@kibibit/configit';

@Configuration()
export class AchievibitConfig extends BaseConfig {
  @ConfigVariable('Server port')
  @IsNumber()
    PORT: number;

  @ConfigVariable()
  @IsString()
    JWT_SECRET: string;

  @ConfigVariable()
  @IsString()
    GITHUB_CLIENT_ID: string;

  @ConfigVariable()
  @IsString()
    GITHUB_CLIENT_SECRET: string;

  @ConfigVariable()
  @IsString()
    GITHUB_CALLBACK_URL: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    SMEE_WEBHOOK_PROXY_CHANNEL: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    SMEE_WEBHOOK_TARGET_URL: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    GITLAB_CLIENT_ID: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    GITLAB_CLIENT_SECRET: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    GITLAB_CALLBACK_URL: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    BITBUCKET_CLIENT_ID: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    BITBUCKET_CLIENT_SECRET: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    BITBUCKET_CALLBACK_URL: string;

  @ConfigVariable()
  @IsString()
    MONGO_URL: string;

  @ConfigVariable()
  @IsString()
    MONGO_DB_NAME: string;
}
