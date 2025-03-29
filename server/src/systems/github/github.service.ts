import { join } from 'path';

import { readFileSync } from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import { Octokit } from '@octokit/core';

import { Injectable } from '@nestjs/common';

import { configService, Logger } from '@kb-config';
import { SystemEnum, User } from '@kb-models';
import { RepositoriesService } from '@kb-repositories';
import { UsersService } from '@kb-users';
import { OrganizationsService } from '@kb-organizations';

export interface IInstallationAccessTokenResponse {
  token: string;
  expires_at: string;
  // Add other fields from the response if needed
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly privateKey: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly repositoriesService: RepositoriesService,
    private readonly organizationsService: OrganizationsService
  ) {
    // Load your private key from the .pem file
    this.privateKey = readFileSync(
      join(configService.appRoot, 'keys', 'private-key.pem'),
      'utf8'
    );
  }

  async getAppInstallationRepositories(installation: any) {
    const { createAppAuth } = await import('@octokit/auth-app');

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: configService.config.GITHUB_APP_ID,
        privateKey: this.privateKey,
        installationId: installation.id
      }
    });

    // get installation access token
    const { token } = await octokit.auth({
      type: 'installation'
    }) as any;

    const installationOctokit = new Octokit({
      auth: token
    });

    const { data } = await installationOctokit.request('GET /installation/repositories', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json',
        per_page: 100
      }
    });

    return data;
  }

  async getAppInstallations(): Promise<any> {
    const { createAppAuth } = await import('@octokit/auth-app');
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: configService.config.GITHUB_APP_ID,
        privateKey: this.privateKey
      }
    });

    return await octokit.request('GET /app/installations', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        accept: 'application/vnd.github+json',
        per_page: 100
      }
    });
  }

  private generateGithubAppJwt(): string {
    // Current time in seconds
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      // Issued at time
      iat: now,
      // Expiration time (10 minutes maximum)
      exp: now + 600,
      // GitHub App's identifier
      iss: configService.config.GITHUB_APP_ID
    };

    const token = jwt.sign(
      payload,
      this.privateKey,
      { algorithm: 'RS256' }
    );

    return token;
  }

  /**
   * After being redirected back to the app from the
   * GitHub App installation flow, we need to exchange
   * the temporary code for an access token.
   *
   * Then, we want to store the repository in the db
   * with the access token and the owning user.
   */
  async getInstallationAccessToken(
    installationId: number,
    repoFullName: string,
    user: User
  ) {
    // Get the user's GitHub integration
    // const githubIntegration = user
    //   .integrations
    //   .find((integration) => integration.system === SystemEnum.GITHUB);

    const installationUrl =
    `https://api.github.com/app/installations/${ installationId }/access_tokens`;

    const installationResponse = await fetch(installationUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${ this.generateGithubAppJwt() }`
      }
    });

    const installationJson = await installationResponse.json();
    const installationAccessToken = installationJson.token;

    if (!installationAccessToken) {
      throw new Error('Failed to get installation access token');
    }

    const installationDetails = await this.getInstallationDetails(installationId);

    console.log('installationDetails', installationDetails);

    const repos = await this.getInstallationRepositories(installationAccessToken, user);

    if (installationDetails.account.type === 'Organization') {
      // check if organization is already in the db
      // if not, create it
      // this should never happen since a user can only install
      // an app on an organization they are a part of
      // but it's good to check anyway
    }

    for (const repo of repos.repositories) {
      let organization = null;

      if (repo.owner.type === 'Organization') {
        this.logger.verbose('trying to find organization', {
          name: repo.owner.login
        });
        organization = await this.organizationsService.findById(repo.owner.login);
        this.logger.verbose('found organization', {
          name: repo.owner.login,
          organization
        });

        if (!organization) {
          organization = await this.organizationsService.create({
            name: repo.owner.login,
            system: SystemEnum.GITHUB,
            owner: user,
            members: [ user ],
            repositories: []
          });
        }
      }

      // create a new repo in the db
      await this.repositoriesService.create(
        {
          name: repo.name,
          fullname: repo.full_name,
          url: repo.html_url,
          owner: user,
          organization: organization,
          system: SystemEnum.GITHUB
          // private: repo.private
        },
        repo.description,
        repo.languages
      );
    }

    return repos.repositories.map((repo) => repo.full_name);
  }

  async getInstallationDetails(installationId: number): Promise<any> {
    const jwtToken = this.generateGithubAppJwt();

    const response = await fetch(`https://api.github.com/app/installations/${ installationId }`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ jwtToken }`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get installation details: ${ error }`);
    }

    const data = await response.json();

    // This includes the 'account' information
    return data;
  }

  async getInstallationRepositories(installationAccessToken: number, user: User): Promise<any> {
    const response = await fetch('https://api.github.com/installation/repositories', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ installationAccessToken }`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get repositories: ${ error }`);
    }

    const data = await response.json();

    return data;
  }

  async getSessionUserInstallations(user: User) {
    const githubIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITHUB);

    const octokit = new Octokit({
      auth: githubIntegration.accessToken
    });

    const { data: installations } = await octokit.request('GET /app/installations');

    return installations;
  }

  async getGithubReposAccessibleByUser(user: User) {
    const githubUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITHUB);

    if (!githubUserIntegration || !githubUserIntegration.accessToken) {
      return [];
    }

    const octokit = new Octokit({
      auth: githubUserIntegration.accessToken
    });

    const userRepos = await octokit.request('GET /user/repos', {
      type: 'owner',
      // Adjust as needed
      per_page: 500
    });

    const userReposLean = userRepos.data.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      url: repo.html_url,
      owner: repo.owner.login,
      system: SystemEnum.GITHUB,
      private: repo.private
    }));

    return userReposLean;
  }
}
