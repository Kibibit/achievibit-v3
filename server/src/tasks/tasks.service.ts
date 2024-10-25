import { bgBlue, bgYellow } from 'colors';
import { pad } from 'lodash';

import { Injectable } from '@nestjs/common';

import { Logger } from '@kb-config';
import { GithubService } from '@kb-systems';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly githubService: GithubService
  ) {}

  // @Timeout(5000)
  async handleTimeout() {
    this.logger.debug(bgBlue.white.bold(' ~= Start syncing Github App installations =~ '));
    const githubSyncLogger = new Logger('GithubSyncTask');
    await this.syncGithubAppInstallations(githubSyncLogger);
  }

  // @Cron(CronExpression.EVERY_12_HOURS)
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  private async syncGithubAppInstallations(
    logger: Logger = this.logger
  ) {
    try {
      const installations = await this.githubService.getAppInstallations();

      if (installations?.data?.length === 0) {
        logger.verbose('No installations found');
        return;
      }

      for (const installation of installations.data) {
        const installationReposLean = await this.syncGithubAppInstallation(
          installation,
          logger
        );
      }

      return installations;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async syncGithubAppInstallation(
    installation: any,
    logger: Logger = this.logger
  ) {
    installation.repositoriesData = await this.githubService.getAppInstallationRepositories(
      installation
    );

    const installationReposLean = installation.repositoriesData.repositories.map((repo: any) => ({
      name: repo.full_name,
      id: repo.id,
      private: repo.private,
      archived: repo.archived,
      owner: repo.owner.login,
      isOwnerOrg: repo.owner.type === 'Organization',
      url: repo.html_url
    }));

    // check if installation is already in the db
    // if not, create it and its repos.
    // also, create the repo owner regardless of if it's an org or user (if it doesn't exist)
    // if the owner is a github user:
    // - connect the user to the installation as an owner
    // - connect the user to the repo as an owner
    // if the owner is an org:
    // - connect the org to the installation as the organization owner
    // - try and find other installations with the same org
    // - if found, connect the installer as the installation owner
    // - if not found, leave the installation owner empty
    // - when someone from the org logs in, they will be checked if they have permissions to install the app
    //   on behalf of the org. If they do, they will be connected as the installation owner
    // - if not, show a message that tells them there's an orphaned installation and they should contact the
    //   organization owner to connect the installation to the org (by logging in)

    const idLength = installation.id.toString().length;
    const paddedId = pad(installation.id, idLength + 2, ' ');
    const coloredId = bgYellow.black.bold(paddedId);
    logger.verbose(`Installation found: ${ coloredId }`, {
      repos: installationReposLean
    });

    return installationReposLean;
  }
}
