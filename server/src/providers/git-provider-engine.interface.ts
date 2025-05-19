import { Repository } from '@kb-models';

import { GitIntegration } from './git-integration.entity';

export interface IGitProviderEngine {
  canReauthorize(
    integration: GitIntegration,
    repo: Repository
  ): Promise<boolean>;
}
