import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { activeUserResolver } from './services/active-user-resolver';
import { ProfileIntegrationsComponent } from './pages/user-profile/profile-integrations/profile-integrations.component';
import { ProfileOverviewComponent } from './pages/user-profile/profile-overview/profile-overview.component';
import { ProfileSettingsComponent } from './pages/user-profile/profile-settings/profile-settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
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
  },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
  // { path: 'first-component', component: FirstComponent }
];
