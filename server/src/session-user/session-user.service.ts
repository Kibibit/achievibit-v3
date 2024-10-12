

import { Injectable } from '@nestjs/common';

import { Logger } from '@kb-config';
import { Order, SystemEnum, User } from '@kb-models';
import { RepositoriesService } from '@kb-repositories';

import { BitbucketService } from '../systems/bitbucket/bitbucket.service';
import { GithubService } from '../systems/github/github.service';
import { GitlabService } from '../systems/gitlab/gitlab.service';

@Injectable()
export class SessionUserService {
  private readonly logger = new Logger(SessionUserService.name);

  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly bitbucketService: BitbucketService
  ) {}

  async getAppInstalledByUserRepos(user: User) {
    const repos = await this.repositoriesService.findAll({
      order: Order.DESC,
      skip: 0,
      take: 100
    }, {
      owner: {
        id: user.id
      },
      system: SystemEnum.GITHUB
    });

    return repos.data.map((repo) => ({
      name: repo.name,
      full_name: repo.fullname,
      integrated: true,
      owner: repo.owner.username,
      private: false,
      system: SystemEnum.GITHUB,
      url: ''
    }));
  }

  async getAllReposAccessibleByUser(user: User) {
    const githubRepos = await this.githubService.getGithubReposAccessibleByUser(user);
    const gitlabRepos = await this.gitlabService.getGitlabReposAccessibleByUser(user);
    const bitbucketRepos = await this.bitbucketService.getBitbucketReposAccessibleByUser(user);

    return [
      ...githubRepos,
      ...gitlabRepos,
      ...bitbucketRepos
    ];
  }

  getGitlabReposAccessibleByUser(user: User) {
    return this.gitlabService.getGitlabReposAccessibleByUser(user);
  }

  getBitbucketReposAccessibleByUser(user: User) {
    return this.bitbucketService.getBitbucketReposAccessibleByUser(user);
  }

  getGithubReposAccessibleByUser(user: User) {
    return this.githubService.getGithubReposAccessibleByUser(user);
  }

  installWebhookOnRepo(user: User, repoFullName: string, system: SystemEnum, installationId?: number) {
    if (system === SystemEnum.GITHUB) {
      return this.githubService.getInstallationAccessToken(installationId, repoFullName, user);
    }

    if (system === SystemEnum.GITLAB) {
      return this.gitlabService.installWebhookOnRepo(repoFullName, user);
      console.log('installWebhookOnRepo', repoFullName, user);
    }

    if (system === SystemEnum.BITBUCKET) {
      return this.bitbucketService.installWebhookOnRepo(repoFullName, user);
    }
  }

  uninstallWebhookOnRepo(user: User, repoFullName: string, system: SystemEnum) {
    if (system === SystemEnum.GITHUB) {
      // return this.githubService.uninstallWebhookOnRepo(repoFullName, user);
    }

    if (system === SystemEnum.GITLAB) {
      return this.gitlabService.uninstallWebhookOnRepo(repoFullName, user);
    }

    if (system === SystemEnum.BITBUCKET) {
      return this.bitbucketService.uninstallWebhookOnRepo(repoFullName, user);
    }
  }
}
