import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { ApiService } from './api.service';

export const activeUserResolver: ResolveFn<User> = () => {
  const apiService = inject(ApiService);
  return apiService.getLoggedInUser();
};
