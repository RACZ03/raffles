import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRutasComponent } from './detalle-rutas/detalle-rutas.component';
import { DetalleVendedoresComponent } from './detalle-vendedores/detalle-vendedores.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path:'', component: ReportComponent,
    children: [
      {
        path: 'detalle-rutas',
        component: DetalleRutasComponent
      },
      {
        path: 'detalle-vendedores',
        component: DetalleVendedoresComponent
      }
    ]
}
  //loadchildren

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
