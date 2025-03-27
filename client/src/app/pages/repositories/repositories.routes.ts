import { Routes } from '@angular/router';

import { RepositoriesAllComponent } from './repositories-all/repositories-all.component';
import { RepositoryProfileComponent } from './repository-profile/repository-profile.component';
import { repoByFullnameResolver } from './repo-by-fullname-resolver';
import { RepositoriesComponent } from './repositories.component';

export const repositoriesRoutes: Routes = [
  {
    path: 'repos',
    component: RepositoriesComponent,
    children: [
      {
        path: '',
        component: RepositoriesAllComponent
      },
      {
        path: ':fullname',
        component: RepositoryProfileComponent,
        resolve: {
          repository: repoByFullnameResolver
        }
      }
    ]
  }
];
