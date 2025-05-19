import { Injectable } from '@nestjs/common';

import { Repository } from '@kb-models';

import { GitIntegration } from './git-integration.entity';
import { IGitProviderEngine } from './git-provider-engine.interface';

@Injectable()
export class GitHubEngine implements IGitProviderEngine {
  async canReauthorize(integration: GitIntegration, repo: Repository): Promise<boolean> {
    if (!integration.token || !repo.fullname) return false;

    try {
      const { Octokit } = await import('@octokit/rest');

      const [ owner, repoName ] = repo.fullname.split('/');
      const octokit = new Octokit({ auth: integration.token });

      const { data } = await octokit.rest.repos.getCollaboratorPermissionLevel({
        owner,
        repo: repoName,
        username: integration.username
      });

      return data.permission === 'admin';
    } catch (err) {
      if ([ 403, 404 ].includes(err.status)) return false;
      throw err;
    }
  }
}
