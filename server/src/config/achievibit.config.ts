import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseConfig, Configuration, ConfigVariable } from '@kibibit/configit';

@Configuration()
export class AchievibitConfig extends BaseConfig {
  @ConfigVariable([
    'The base URL of the backend service, used for constructing API endpoints. ',
    'It also acts as the frontend base url since the frontend is served from the backend'
  ])
  @IsString()
    BASE_BACKEND_URL: string;

  @ConfigVariable([
    'Defines which port the application will run on'
  ])
  @IsNumber()
    PORT: number;

  @ConfigVariable([
    'Secret key used for signing and verifying JWT tokens.',
    'Should be a long, random string for security'
  ].join(' '))
  @IsString()
    JWT_SECRET: string;

  @ConfigVariable([
    'You can get this from your GitHub OAuth App settings.',
    'Create a GitHub OAuth App at https://github.com/settings/developers'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITHUB_CLIENT_ID: string;

  @ConfigVariable([
    'This secret is used to authenticate your app with GitHub.',
    'Create a GitHub OAuth App at https://github.com/settings/developers'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITHUB_CLIENT_SECRET: string;

  @ConfigVariable([
    'The URL GitHub will redirect to after authentication'
  ])
  @IsString()
  @IsOptional()
    GITHUB_CALLBACK_URL: string;

  @ConfigVariable([
    'Channel ID for Smee webhook proxy.',
    'Used to route webhooks when developing locally without a public IP'
  ].join(' '))
  @IsString()
  @IsOptional()
    SMEE_WEBHOOK_PROXY_CHANNEL: string;

  @ConfigVariable([
    'The target URL for webhook proxying when using Smee.io.',
    'Where Smee forwards the webhook payload'
  ].join(' '))
  @IsString()
  @IsOptional()
    SMEE_WEBHOOK_TARGET_URL: string;

  @ConfigVariable([
    'You can get this from your GitLab application settings.',
    'Create a GitLab OAuth App at https://gitlab.com/-/profile/applications'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITLAB_CLIENT_ID: string;

  @ConfigVariable([
    'This secret is used to authenticate your app with GitLab.',
    'Create a GitLab OAuth App at https://gitlab.com/-/profile/applications'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITLAB_CLIENT_SECRET: string;

  @ConfigVariable([
    'The URL GitLab will redirect to after authentication'
  ])
  @IsString()
  @IsOptional()
    GITLAB_CALLBACK_URL: string;

  @ConfigVariable([
    'You can get this from your Bitbucket app settings.',
    'Create a Bitbucket OAuth Consumer at https://bitbucket.org/account/settings/app-passwords'
  ].join(' '))
  @IsString()
  @IsOptional()
    BITBUCKET_CLIENT_ID: string;

  @ConfigVariable([
    'This secret is used to authenticate your app with Bitbucket.',
    'Create a Bitbucket OAuth Consumer at https://bitbucket.org/account/settings/app-passwords'
  ].join(' '))
  @IsString()
  @IsOptional()
    BITBUCKET_CLIENT_SECRET: string;

  @ConfigVariable([
    'The URL Bitbucket will redirect to after authentication'
  ])
  @IsString()
  @IsOptional()
    BITBUCKET_CALLBACK_URL: string;

  @ConfigVariable([
    'GitHub webhook secret for verifying webhook payloads.',
    'Ensure that webhooks come from GitHub'
  ].join(' '))
  @IsString()
    GITHUB_WEBHOOK_SECRET: string;

  @ConfigVariable([
    'GitLab webhook secret for verifying webhook payloads.',
    'Ensure that webhooks come from GitLab'
  ].join(' '))
  @IsString()
    GITLAB_WEBHOOK_SECRET: string;

  @ConfigVariable([
    'Bitbucket webhook secret for verifying webhook payloads.',
    'Ensure that webhooks come from Bitbucket'
  ].join(' '))
  @IsString()
    BITBUCKET_WEBHOOK_SECRET: string;

  @ConfigVariable([
    'The host address of the Postgres database, e.g., localhost or a remote IP'
  ])
  @IsString()
  @IsOptional()
    POSTGRES_HOST: string;

  @ConfigVariable([
    'The port on which Postgres is running, typically 5432'
  ])
  @IsNumber()
  @IsOptional()
    POSTGRES_PORT: number;

  @ConfigVariable([
    'The username to authenticate with the Postgres database'
  ])
  @IsString()
  @IsOptional()
    POSTGRES_USER: string;

  @ConfigVariable('The password for the Postgres user')
  @IsString()
  @IsOptional()
    POSTGRES_PASSWORD: string;

  @ConfigVariable('The name of the specific database to connect to within Postgres')
  @IsString()
  @IsOptional()
    POSTGRES_DATABASE: string;

  @ConfigVariable([
    'You can find this in your GitHub App settings.',
    'Create a GitHub App at https://github.com/settings/apps'
  ].join(' '))
  // @IsString()
  @IsOptional()
    GITHUB_APP_ID: string;

  @ConfigVariable([
    'You can find this in your GitHub App settings.',
    'Create a GitHub App at https://github.com/settings/apps'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITHUB_APP_CLIENT_ID: string;

  @ConfigVariable([
    'Used to authenticate your GitHub App with GitHub.',
    'Create a GitHub App at https://github.com/settings/apps'
  ].join(' '))
  @IsString()
  @IsOptional()
    GITHUB_APP_CLIENT_SECRET: string;

  @ConfigVariable([
    'Enable or disable automatic database synchronization.',
    'If true, the database schema will be synchronized automatically.',
    'SHOULD NOT be used in production.'
  ].join(' '))
  @IsOptional()
  @IsBoolean()
    SYNCHRONIZE_DATABASE: boolean;

  @ConfigVariable([
    'openai api key.',
    'You can get this from your OpenAI account settings.'
  ].join(' '))
  @IsString()
  @IsOptional()
    OPENAI_API_KEY: string;
}
