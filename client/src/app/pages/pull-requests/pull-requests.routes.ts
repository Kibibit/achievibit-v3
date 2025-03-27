import { Routes } from '@angular/router';

import { UserRolesEnum } from '@kibibit/achievibit-sdk';

import { PullRequestAllComponent } from './pull-request-all/pull-request-all.component';
import { PullRequestProfileComponent } from './pull-request-profile/pull-request-profile.component';
import { prByIdResolver } from './pr-by-id-resolver';
import { PullRequestsComponent } from './pull-requests.component';

export const pullRequestsRoutes: Routes = [
  {
    path: 'prs',
    component: PullRequestsComponent,
    // canActivate: [ roleGuard ],
    data: { roles: [ UserRolesEnum.Admin ] },
    children: [
      {
        path: '',
        component: PullRequestAllComponent
      },
      {
        path: ':id',
        component: PullRequestProfileComponent,
        resolve: {
          pr: prByIdResolver
        }
      }
    ]
  }
];
