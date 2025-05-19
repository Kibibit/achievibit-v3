import axios from 'axios';
import { Gitlab } from '@gitbeaker/rest';

import { Injectable } from '@nestjs/common';

import { GitLabStrategy } from '@kb-auth';
import { configService, Logger } from '@kb-config';
import { Order, SystemEnum, User } from '@kb-models';
import { RepositoriesService } from '@kb-repositories';
import { UsersService } from '@kb-users';

@Injectable()
export class GitlabService {
  private readonly logger = new Logger(GitlabService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly repositoriesService: RepositoriesService
  ) {}

  async installWebhookOnRepo(
    repoFullName: string,
    user: User
  ) {
    await this.refreshGitlabAccessToken(user);
    const gitlabIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITLAB);

    const gitlabApi = new Gitlab({
      oauthToken: gitlabIntegration.accessToken
    });

    const [ owner, repo ] = repoFullName.split('/');

    const hooks = await gitlabApi.ProjectHooks.all(repoFullName);

    const existingHook = hooks.find((hook) => hook.url === 'https://kibibit.io/gitlab-webhook');

    if (existingHook) {
      if (existingHook.push_events && existingHook.merge_requests_events) {
        return existingHook;
      }

      // update the hook
      const updatedHook = await gitlabApi.ProjectHooks.edit(
        repoFullName,
        existingHook.id,
        'https://kibibit.io/gitlab-webhook',
        {
          pushEvents: true,
          mergeRequestsEvents: true
        }
      );

      return updatedHook;
    }

    // create the hook
    const newHook = await gitlabApi.ProjectHooks.add(
      repoFullName,
      'https://kibibit.io/gitlab-webhook',
      {
        pushEvents: true,
        mergeRequestsEvents: true
      }
    );

    const newRepository = await this.repositoriesService.create({
      name: repo,
      fullname: repoFullName,
      url: `https://gitlab.com/${ repoFullName }`,
      owner: user,
      system: SystemEnum.GITLAB,
      externalId: repoFullName
    });

    return newHook;
  }

  async uninstallWebhookOnRepo(
    repoFullName: string,
    user: User
  ) {
    await this.refreshGitlabAccessToken(user);
    const gitlabIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITLAB);

    const gitlabApi = new Gitlab({
      oauthToken: gitlabIntegration.accessToken
    });

    const [ owner, repo ] = repoFullName.split('/');

    const hooks = await gitlabApi.ProjectHooks.all(repoFullName);

    const existingHook = hooks.find((hook) => hook.url === 'https://kibibit.io/gitlab-webhook');

    if (!existingHook) {
      return;
    }

    await gitlabApi.ProjectHooks.remove(repoFullName, existingHook.id);

    await this.repositoriesService.deleteRepo(repoFullName, SystemEnum.GITLAB);

    return;
  }

  async getGitlabReposAccessibleByUser(user: User) {
    const gitlabUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITLAB);

    if (!gitlabUserIntegration || !gitlabUserIntegration.accessToken) {
      return [];
    }

    await this.refreshGitlabAccessToken(user);

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

    const existingRepos = await this.repositoriesService.findAll({
      take: 500,
      order: Order.ASC,
      skip: 0
    }, {
      owner: {
        id: user.id
      },
      system: SystemEnum.GITLAB
    });

    const userReposLean = userRepos.map((repo) => ({
      name: repo.name,
      full_name: repo.path_with_namespace,
      url: repo.web_url,
      owner: (repo.owner as any)?.username || repo.namespace.path,
      system: SystemEnum.GITLAB,
      private: repo.visibility === 'private',
      integrated: existingRepos.data.some((existingRepo) => existingRepo.fullname === repo.path_with_namespace)
    }));


    return userReposLean;
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
          scope: GitLabStrategy.SCOPES
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
