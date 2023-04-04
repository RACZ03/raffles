import { NgModule } from '@angular/core';
import { BusinessSetupComponent } from './business-setup.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: BusinessSetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingBusinessSetupModule { }
