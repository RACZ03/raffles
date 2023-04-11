import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRecibosComponent } from './list-recibos/list-recibos.component';

const routes: Routes = [
  { path: ':return', component: ListRecibosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecibosRoutingModule { }
