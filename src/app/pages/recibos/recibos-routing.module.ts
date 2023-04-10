import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRecibosComponent } from './list-recibos/list-recibos.component';
import { RecibosComponent } from './recibos/recibos.component';
import { ListRecibosEspecialesComponent } from './list-recibos-especiales/list-recibos-especiales.component';

const routes: Routes = [
  { path: '', component: RecibosComponent,
  children: [
    {
     path: 'recibos-normales',
     component: ListRecibosComponent
   },
   {
     path: 'recibos-especiales',
     component: ListRecibosEspecialesComponent
   }
  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecibosRoutingModule { }
