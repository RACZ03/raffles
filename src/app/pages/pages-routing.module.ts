import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
// import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'business', loadChildren: () => import('./business/business.module').then(m => m.BusinessModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      // {
      //   path: '**',
      //   component: NotFoundComponent,
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
