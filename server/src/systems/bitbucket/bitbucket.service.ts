import axios from 'axios';
import { Bitbucket } from 'bitbucket';
import { isEqual } from 'lodash';

import { Injectable } from '@nestjs/common';

import { configService } from '@kb-config';
import { Order, SystemEnum, User } from '@kb-models';
import { RepositoriesService } from '@kb-repositories';
import { UsersService } from '@kb-users';

@Injectable()
export class BitbucketService {
  constructor(
    private readonly usersService: UsersService,
    private readonly repositoriesService: RepositoriesService
  ) {}

  async installWebhookOnRepo(
    repoFullName: string,
    user: User
  ) {
    const EVENTS = [
      'repo:push',
      // events for code reviews
      'pullrequest:created'
    ];

    await this.refreshBitbucketAccessToken(user);
    const bitbucketIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.BITBUCKET);

    const bitbucket = new Bitbucket({
      auth: {
        token: bitbucketIntegration.accessToken
      }
    });

    const [ owner, repo ] = repoFullName.split('/');

    const { data: hooks } = await bitbucket.repositories.listWebhooks({
      repo_slug: repo,
      workspace: owner
    });

    console.log('hooks', hooks);

    const existingHook = hooks.values.find((hook) => hook.description === 'Kibibit Webhook');

    if (existingHook) {
      if (existingHook.active && isEqual(existingHook.events, EVENTS)) {
        return existingHook;
      }

      // update the hook
      const updatedHook = await bitbucket.repositories.updateWebhook({
        repo_slug: repo,
        workspace: owner,
        uid: existingHook.uuid as string,
        _body: {
          description: 'Kibibit Webhook',
          url: 'https://kibibit.io/api/webhook/bitbucket',
          active: true,
          events: EVENTS
        }
      } as any);

      return updatedHook;
    }

    const newHook = await bitbucket.repositories.createWebhook({
      repo_slug: repo,
      workspace: owner,
      _body: {
        description: 'Kibibit Webhook',
        url: 'https://kibibit.io/api/webhook/bitbucket',
        active: true,
        events: EVENTS
      }
    });

    // create repo in app db
    const dbRepo = await this.repositoriesService.create({
      name: repo,
      fullname: repoFullName,
      url: `https://bitbucket.org/${ repoFullName }`,
      owner: user,
      system: SystemEnum.BITBUCKET
    });

    return newHook;
  }

  async uninstallWebhookOnRepo(
    repoFullName: string,
    user: User
  ) {
    await this.refreshBitbucketAccessToken(user);
    const bitbucketIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.BITBUCKET);

    const bitbucket = new Bitbucket({
      auth: {
        token: bitbucketIntegration.accessToken
      }
    });

    const [ owner, repo ] = repoFullName.split('/');

    const { data: hooks } = await bitbucket.repositories.listWebhooks({
      repo_slug: repo,
      workspace: owner
    });

    const existingHook = hooks.values.find((hook) => hook.description === 'Kibibit Webhook');

    if (!existingHook) {
      await this.repositoriesService.deleteRepo(repoFullName, SystemEnum.BITBUCKET);

      return;
    }

    await bitbucket.repositories.deleteWebhook({
      repo_slug: repo,
      workspace: owner,
      uid: existingHook.uuid as string
    });

    await this.repositoriesService.deleteRepo(repoFullName, SystemEnum.BITBUCKET);

    return;
  }

  async getBitbucketReposAccessibleByUser(user: User) {
    const bitbucketUserIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.BITBUCKET);

    if (!bitbucketUserIntegration || !bitbucketUserIntegration.accessToken) {
      return [];
    }

    await this.refreshBitbucketAccessToken(user);

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

    const existingRepos = await this.repositoriesService.findAll({
      take: 500,
      order: Order.ASC,
      skip: 0
    }, {
      owner: {
        id: user.id
      },
      system: SystemEnum.BITBUCKET
    });

    const userReposLean = userRepos.data.values.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      url: repo.links.html.href,
      owner: repo.owner.display_name,
      system: SystemEnum.BITBUCKET,
      private: repo.is_private,
      integrated: existingRepos.data.some((existingRepo) => existingRepo.fullname === repo.full_name)
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
}
