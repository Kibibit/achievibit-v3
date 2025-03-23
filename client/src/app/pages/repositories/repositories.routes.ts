import { Routes } from '@angular/router';

import { RepositoriesComponent } from './repositories.component';

export const repositoriesRoutes: Routes = [
  {
    path: 'repos',
    component: RepositoriesComponent,
    children: [
      {
        path: ':repoName',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
