import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages/app-status/app-status.routes')
      .then((m) => m.appStatusRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./pages/user-profile/user-profile.routes')
      .then((m) => m.userProfileRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./pages/organizations/organizations.routes')
      .then((m) => m.organizationsRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./pages/users/users.routes')
      .then((m) => m.usersRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./pages/repositories/repositories.routes')
      .then((m) => m.repositoriesRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./pages/pull-requests/pull-requests.routes')
      .then((m) => m.pullRequestsRoutes)
  }
];
