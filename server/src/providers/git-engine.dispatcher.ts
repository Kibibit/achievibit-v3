import { Injectable } from '@nestjs/common';

import { BitbucketEngine } from './bitbucket.engine';
import { IGitProviderEngine } from './git-provider-engine.interface';
import { GitHubEngine } from './github.engine';
import { GitLabEngine } from './gitlab.engine';

@Injectable()
export class GitEngineDispatcher {
  constructor(
    private readonly github: GitHubEngine,
    private readonly gitlab: GitLabEngine,
    private readonly bitbucket: BitbucketEngine
  ) {}

  getEngine(provider: string): IGitProviderEngine {
    switch (provider) {
      case 'github': return this.github;
      case 'gitlab': return this.gitlab;
      case 'bitbucket': return this.bitbucket;
      default: throw new Error(`Unsupported provider: ${ provider }`);
    }
  }
}
