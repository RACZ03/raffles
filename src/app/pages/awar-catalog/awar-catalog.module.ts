import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwarCatalogComponent } from './awar-catalog.component';
import { AwarCatalogRoutingModule } from './awar-catalog-routing.module';



@NgModule({
  declarations: [
    AwarCatalogComponent
  ],
  imports: [
    CommonModule,
    AwarCatalogRoutingModule
  ]
})
export class AwarCatalogModule { }
