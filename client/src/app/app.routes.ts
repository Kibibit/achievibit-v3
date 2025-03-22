import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { KeyboardInputComponent } from './keyboard-input/keyboard-input.component';
import { activeUserResolver } from './services/active-user-resolver';
import { ProfileIntegrationsComponent } from './user-profile/profile-integrations/profile-integrations.component';
import { ProfileOverviewComponent } from './user-profile/profile-overview/profile-overview.component';
import { ProfileSettingsComponent } from './user-profile/profile-settings/profile-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: 'keyboard', component: KeyboardInputComponent },
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
