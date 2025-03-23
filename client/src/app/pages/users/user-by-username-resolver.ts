import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { UsersApiService } from '../../services/api/users.service';

export const userByUsernameResolver: ResolveFn<User> = (route) => {
  const usersService = inject(UsersApiService);
  const username = route.paramMap.get('username') as string;

  return usersService.getUserByUsername(username);
};
