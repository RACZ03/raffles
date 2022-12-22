import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwarCatalogComponent } from './awar-catalog.component';
import { AwarCatalogRoutingModule } from './awar-catalog-routing.module';
import { AddAwarCatalogComponent } from './add-awar-catalog/add-awar-catalog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AwarCatalogComponent,
    AddAwarCatalogComponent
  ],
  imports: [
    CommonModule,
    AwarCatalogRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule
  ]
})
export class AwarCatalogModule { }
