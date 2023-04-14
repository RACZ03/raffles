import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LimitsSuperAdminComponent } from './limits-super-admin.component';

const routes: Routes = [{ path: '', component: LimitsSuperAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimitsSuperAdminRoutingModule { }
