import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Repository } from '@kibibit/achievibit-sdk';

import { RepositoriesApiService } from '../../services/api/repositories.service';

export const repoByFullnameResolver: ResolveFn<Repository> = (route) => {
  const reposApiService = inject(RepositoriesApiService);
  const fullname = route.paramMap.get('fullname') as string;
  const splittedFullname = fullname.split('/');
  const owner = splittedFullname[0];
  const name = splittedFullname[1];

  return reposApiService.getRepoByName(owner, name);
};
