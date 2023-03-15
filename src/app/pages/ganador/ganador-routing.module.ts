import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListGanadorComponent } from './list-ganador/list-ganador.component';

const routes: Routes = [{ path: '', component: ListGanadorComponent}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanadorRoutingModule { }
