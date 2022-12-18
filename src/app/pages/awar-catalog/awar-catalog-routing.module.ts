import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwarCatalogComponent } from './awar-catalog.component';




const routes: Routes = [{ path: '', component: AwarCatalogComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AwarCatalogRoutingModule { }
