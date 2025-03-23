import { Routes } from '@angular/router';

import { activeUserResolver } from '../../services/active-user-resolver';
import { ProfileIntegrationsComponent } from './profile-integrations/profile-integrations.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { UserProfileComponent } from './user-profile.component';

export const userProfileRoutes: Routes = [
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: ProfileOverviewComponent,
        resolve: { user: activeUserResolver }
      },
      {
        path: 'integrations',
        component: ProfileIntegrationsComponent,
        resolve: { user: activeUserResolver }
      },
      {
        path: 'settings',
        component: ProfileSettingsComponent,
        resolve: { user: activeUserResolver }
      }
    ]
  }
];
