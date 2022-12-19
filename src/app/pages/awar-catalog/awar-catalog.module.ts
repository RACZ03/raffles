import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwarCatalogComponent } from './awar-catalog.component';
import { AwarCatalogRoutingModule } from './awar-catalog-routing.module';
import { AddAwarCatalogComponent } from './add-awar-catalog/add-awar-catalog.component';



@NgModule({
  declarations: [
    AwarCatalogComponent,
    AddAwarCatalogComponent
  ],
  imports: [
    CommonModule,
    AwarCatalogRoutingModule
  ]
})
export class AwarCatalogModule { }
