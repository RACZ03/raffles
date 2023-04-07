import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DetalleVendedoresComponent } from './report/detalle-vendedores/detalle-vendedores.component';
import { AdminGuard } from '../shared/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canLoad: [ AdminGuard ]
      },
      // {
      //   path: 'user-profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      // },
      // {
      //   path: 'support', loadChildren: () => import('./support/support.module').then(m => m.SupportModule),
      // },
      // SUPER ADMIN
      {
        path: 'business', loadChildren: () => import('./super-admin/business/business.module').then(m => m.BusinessModule),
        canLoad: [ AdminGuard ]
      },
      // SUPER ADMIN
      {
        path: 'users', loadChildren: () => import('./super-admin/users/users.module').then(m => m.UsersModule),
        canLoad: [ AdminGuard ]
      },
      // ADMIN
      {
        path: 'business-profile', loadChildren: () => import('./admin/business-profile/business-profile.module').then(m => m.BusinessProfileModule),
        canLoad: [ AdminGuard ]
      },
      // ADMIN
      {
        path: 'business-users', loadChildren: () => import('./admin/business-users/business-users.module').then(m => m.BusinessUsersModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'business-setup', loadChildren: () => import('./business-setup/business-setup.module').then(m => m.BusinessSetupModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'route', loadChildren: () => import('./route/route.module').then(m => m.RouteModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'award-catalog', loadChildren: () => import('./awar-catalog/awar-catalog.module').then(m => m.AwarCatalogModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'limit', loadChildren: () => import('./limit/limit.module').then(m => m.LimitModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'extraordinary-sales', loadChildren: () => import('./extraordinary-sales/extraordinary-sales.module').then(m => m.ExtraordinarySalesModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'winner', loadChildren: () => import('./ganador/ganador.module').then(m => m.GanadorModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        canLoad: [ AdminGuard ]
      },
      {
        path: 'recibos', loadChildren: () => import('./recibos/recibos.module').then(m => m.RecibosModule),
        canLoad: [ AdminGuard ]
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
