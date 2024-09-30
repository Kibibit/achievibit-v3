
import axios from 'axios';
import { Bitbucket } from 'bitbucket';
import { Gitlab } from '@gitbeaker/rest';
import { Octokit } from '@octokit/core';

import { Injectable } from '@nestjs/common';

import { configService, Logger } from '@kb-config';
import { SystemEnum, User } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class SessionUserService {
  private readonly logger = new Logger(SessionUserService.name);

  constructor(
    private readonly usersService: UsersService
  ) {}

  async getAllReposAccessibleByUser(user: User) {
    const githubRepos = await this.getGithubReposAccessibleByUser(user);
    const gitlabRepos = await this.getGitlabReposAccessibleByUser(user);
    const bitbucketRepos = await this.getBitbucketReposAccessibleByUser(user);

    return [
      ...githubRepos,
      ...gitlabRepos,
      ...bitbucketRepos
    ];
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

  async getGitlabReposAccessibleByUser(user: User) {
    await this.refreshGitlabAccessToken(user);

    const gitlabUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITLAB);

    if (!gitlabUserIntegration || !gitlabUserIntegration.accessToken) {
      return [];
    }

    const gitlabApi = new Gitlab({
      oauthToken: gitlabUserIntegration.accessToken
    });

    // console.log('before gitlabApi.Users.showCurrentUser()');
    // const userInfo = await gitlabApi.Users.showCurrentUser();
    // console.log('Authenticated user:', userInfo);

    const userRepos = await gitlabApi.Projects.all({
      membership: true,
      owned: true,
      perPage: 500
    });

    const userReposLean = userRepos.map((repo) => ({
      name: repo.name,
      full_name: repo.path_with_namespace,
      url: repo.web_url,
      owner: (repo.owner as any)?.username || repo.namespace.path,
      system: SystemEnum.GITLAB,
      private: repo.visibility === 'private'
    }));

    return userReposLean;
  }

  async getBitbucketReposAccessibleByUser(user: User) {
    await this.refreshBitbucketAccessToken(user);

    const bitbucketUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.BITBUCKET);

    if (!bitbucketUserIntegration || !bitbucketUserIntegration.accessToken) {
      return [];
    }

    const bitbucketApi = new Bitbucket({
      auth: {
        token: bitbucketUserIntegration.accessToken
      }
    });

    // const userRepos = await bitbucketApi.repositories.list({
    //   pagelen: 500,
    //   role: 'owner'
    // } as any);

    // get all repos the user has permissions to install the app
    const userRepos = await bitbucketApi.repositories.list({
      pagelen: 500,
      role: 'admin',
      workspace: ''
    });

    const userReposLean = userRepos.data.values.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      url: repo.links.html.href,
      owner: repo.owner.display_name,
      system: SystemEnum.BITBUCKET,
      private: repo.is_private
    }));

    return userReposLean;
  }

  async refreshBitbucketAccessToken(user: User) {
    const bitbucketUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.BITBUCKET);

    // Check if refresh token exists
    if (!bitbucketUserIntegration.refreshToken) {
      throw new Error('No refresh token available to refresh Bitbucket access token');
    }

    try {
      // check if access token is still valid
      if (bitbucketUserIntegration.tokenExpiry && bitbucketUserIntegration.tokenExpiry > new Date()) {
        return user;
      }

      // try and get user profile to check access token
      const bitbucketApi = new Bitbucket({
        auth: {
          token: bitbucketUserIntegration.accessToken
        }
      });

      let isTokenValid = true;
      try {
        await bitbucketApi.user.get({});
      } catch (error) {
        isTokenValid = false;
      }

      if (isTokenValid) {
        return user;
      }

      // Make a request to Bitbucket to refresh the access token
      const response = await axios({
        method: 'post',
        url: 'https://bitbucket.org/site/oauth2/access_token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: bitbucketUserIntegration.refreshToken,
          client_id: configService.config.BITBUCKET_CLIENT_ID,
          client_secret: configService.config.BITBUCKET_CLIENT_SECRET
        }).toString()
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Update the integration object with the new access token and refresh token
      bitbucketUserIntegration.accessToken = access_token;
      if (refresh_token) {
        bitbucketUserIntegration.refreshToken = refresh_token; // Update refresh token if returned
      }

      // Optionally, save the new expiration time if you're tracking it
      bitbucketUserIntegration.tokenExpiry = new Date(Date.now() + expires_in * 1000);

      // Save the updated integration in the user object (and persist to the database)
      await this.usersService.updateIntegrations(user.username, bitbucketUserIntegration);

      // Return the new access token
      return user;
    } catch (error) {
      console.error('Failed to refresh Bitbucket access token:', error.response?.data || error.message);
      throw new Error('Failed to refresh Bitbucket access token');
    }
  }

  private async refreshGitlabAccessToken(user: User) {
    const gitlabUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITLAB);

    // Check if refresh token exists
    if (!gitlabUserIntegration.refreshToken) {
      throw new Error('No refresh token available to refresh GitLab access token');
    }

    try {
      // check if access token is still valid
      if (gitlabUserIntegration.tokenExpiry && gitlabUserIntegration.tokenExpiry > new Date()) {
        return user;
      }

      // try and get user profile to check access token
      const gitlabApi = new Gitlab({
        oauthToken: gitlabUserIntegration.accessToken
      });

      let isTokenValid = true;
      try {
        await gitlabApi.Users.showCurrentUser();
      } catch (error) {
        isTokenValid = false;
      }

      if (isTokenValid) {
        return user;
      }

      // Make a request to GitLab to refresh the oauth token
      const response = await axios({
        method: 'post',
        url: 'https://gitlab.com/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: gitlabUserIntegration.refreshToken,
          client_id: configService.config.GITLAB_CLIENT_ID,
          client_secret: configService.config.GITLAB_CLIENT_SECRET,
          scope: 'api read_user read_repository email openid profile'
        }).toString()
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Update the integration object with the new access token and refresh token
      gitlabUserIntegration.accessToken = access_token;
      if (refresh_token) {
        gitlabUserIntegration.refreshToken = refresh_token;
      }

      // Optionally, you can save the new expiration time if you're tracking it
      gitlabUserIntegration.tokenExpiry = new Date(Date.now() + expires_in * 1000);

      // Save the updated integration in the user object (and persist to the database)
      await this.usersService.updateIntegrations(user.username, gitlabUserIntegration);

      // Return the new access token
      return user;
    } catch (error) {
      this.logger.error('Failed to refresh GitLab access token:', { message: error.message, stack: error.stack });
      throw new Error('Failed to refresh GitLab access token');
    }
  }
}
