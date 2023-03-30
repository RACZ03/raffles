import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleNegociosComponent } from './detalle-negocios/detalle-negocios.component';
import { DetalleRutasComponent } from './detalle-rutas/detalle-rutas.component';
import { DetalleVendedoresComponent } from './detalle-vendedores/detalle-vendedores.component';
import { ReportComponent } from './report/report.component';
import { ResumenVendedorFechaComponent } from './resumen-vendedor-fecha/resumen-vendedor-fecha.component';

const routes: Routes = [
  {
    path:'', component: ReportComponent,
    children: [
       {
        path: 'detalle-vendedores',
        component: DetalleVendedoresComponent
      },
      {
        path: 'detalle-rutas',
        component: DetalleRutasComponent
      },
      {
        path : 'resumen-vendedores', 
        component: ResumenVendedorFechaComponent
      },
      {
        path: 'detalle-negocio',
        component: DetalleNegociosComponent
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
