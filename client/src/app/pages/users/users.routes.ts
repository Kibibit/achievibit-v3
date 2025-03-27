import { Routes } from '@angular/router';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersAllComponent } from './users-all/users-all.component';
import { userByUsernameResolver } from './user-by-username-resolver';
import { UsersComponent } from './users.component';

export const usersRoutes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    children: [
      {
        path: '',
        component: UsersAllComponent
      },
      {
        path: ':username',
        component: UserProfileComponent,
        resolve: {
          user: userByUsernameResolver
        }
      }
    ]
  }
];
