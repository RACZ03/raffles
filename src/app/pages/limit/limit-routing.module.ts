import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LimitComponent } from './limit.component';




const routes: Routes = [{ path: '', component: LimitComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimitRoutingModule { }
