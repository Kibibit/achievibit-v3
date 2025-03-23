import { Routes } from '@angular/router';

import { OrganizationProfileComponent } from './organization-profile/organization-profile.component';
import { OrganizationsAllComponent } from './organizations-all/organizations-all.component';
import { orgByNameResolver } from './org-by-name-resolver';
import { OrganizationsComponent } from './organizations.component';

export const organizationsRoutes: Routes = [
  {
    path: 'orgs',
    component: OrganizationsComponent,
    children: [
      {
        path: '',
        component: OrganizationsAllComponent
      },
      {
        path: ':name',
        component: OrganizationProfileComponent,
        resolve: {
          organization: orgByNameResolver
        }
      }
    ]
  }
];
