import { Gitlab } from '@gitbeaker/rest';

import { Injectable } from '@nestjs/common';

import { Repository } from '@kb-models';

import { GitIntegration } from './git-integration.entity';
import { IGitProviderEngine } from './git-provider-engine.interface';

@Injectable()
export class GitLabEngine implements IGitProviderEngine {
  async canReauthorize(integration: GitIntegration, repo: Repository): Promise<boolean> {
    if (!integration.token || !repo.externalId) return false;

    const api = new Gitlab({ token: integration.token });

    try {
      const member = await api.ProjectMembers.show(Number(repo.externalId), Number(integration.externalId));
      // 40 = Maintainer
      return member.access_level >= 40;
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) return false;
      throw err;
    }
  }
}
