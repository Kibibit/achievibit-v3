import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { KeyboardInputComponent } from './keyboard-input/keyboard-input.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: 'keyboard', component: KeyboardInputComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
  // { path: 'first-component', component: FirstComponent }
];
