
import { Injectable } from '@nestjs/common';

import { Repository } from '../models/repository.entity';
import { GitIntegration } from './git-integration.entity';
import { IGitProviderEngine } from './git-provider-engine.interface';

@Injectable()
export class BitbucketEngine implements IGitProviderEngine {
  async canReauthorize(integration: GitIntegration, repo: Repository): Promise<boolean> {
    if (!integration.token || !repo.fullname) return false;

    const [ workspace, repoSlug ] = repo.fullname.split('/');

    const query = encodeURIComponent(`user.username="${ integration.username }"`);
    const url = `https://api.bitbucket.org/2.0/workspaces/${ workspace }/permissions/repositories?q=${ query }`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${ integration.token }`,
          Accept: 'application/json'
        }
      });

      if (res.status !== 200) {
        if (res.status === 403 || res.status === 404) return false;
        throw new Error(`Bitbucket permissions query failed: ${ res.status }`);
      }

      const data = await res.json();
      const matchingPermission = data.values?.find(
        (perm: any) => perm.repository?.slug === repoSlug
      );

      return matchingPermission?.permission === 'admin';
    } catch (err) {
      console.error('Bitbucket canReauthorize error:', err);
      throw err;
    }
  }
}
