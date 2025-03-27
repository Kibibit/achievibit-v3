import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { PullRequestsApiService } from '../../services/api/pull-requests.service';

export const prByIdResolver: ResolveFn<Record<string, any>> = (route) => {
  const prsApiService = inject(PullRequestsApiService);
  const id = route.paramMap.get('id') as string;

  return prsApiService.getPullRequestById(id);
};
