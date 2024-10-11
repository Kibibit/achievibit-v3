import { IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseConfig, Configuration, ConfigVariable } from '@kibibit/configit';

@Configuration()
export class AchievibitConfig extends BaseConfig {
  @ConfigVariable()
  @IsString()
    BASE_BACKEND_URL: string;

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
    GITHUB_WEBHOOK_SECRET: string;

  @ConfigVariable()
  @IsString()
    GITLAB_WEBHOOK_SECRET: string;

  @ConfigVariable()
  @IsString()
    BITBUCKET_WEBHOOK_SECRET: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    POSTGRES_HOST: string;

  @ConfigVariable()
  @IsNumber()
  @IsOptional()
    POSTGRES_PORT: number;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    POSTGRES_USER: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    POSTGRES_PASSWORD: string;

  @ConfigVariable()
  @IsString()
  @IsOptional()
    POSTGRES_DATABASE: string;

  @ConfigVariable()
  // @IsString()
    GITHUB_APP_ID: string;

  @ConfigVariable()
  @IsString()
    GITHUB_APP_CLIENT_SECRET: string;

  @ConfigVariable()
  @IsOptional()
  @IsBoolean()
    SYNCHRONIZE_DATABASE: boolean;
}
