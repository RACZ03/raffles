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
        path: 'route', loadChildren: () => import('./route/route.module').then(m => m.RouteModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'award-catalog', loadChildren: () => import('./awar-catalog/awar-catalog.module').then(m => m.AwarCatalogModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'limit', loadChildren: () => import('./limit/limit.module').then(m => m.LimitModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'extraordinary-sales', loadChildren: () => import('./extraordinary-sales/extraordinary-sales.module').then(m => m.ExtraordinarySalesModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: 'winner', loadChildren: () => import('./ganador/ganador.module').then(m => m.GanadorModule),
        // canLoad: [ AdminGuard ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
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
