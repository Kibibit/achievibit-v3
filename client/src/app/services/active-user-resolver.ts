import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { MeApiService } from './api/me.service';

export const activeUserResolver: ResolveFn<User> = () => {
  const meApiService = inject(MeApiService);
  return meApiService.getLoggedInUser();
};
