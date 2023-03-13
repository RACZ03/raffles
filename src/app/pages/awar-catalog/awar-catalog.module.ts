import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwarCatalogComponent } from './awar-catalog.component';
import { AwarCatalogRoutingModule } from './awar-catalog-routing.module';
import { AddAwarCatalogComponent } from './add-awar-catalog/add-awar-catalog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NormalComponent } from './normal/normal.component';
import { EspecialComponent } from './especial/especial.component';
import { AddAwwardEspecialComponent } from './add-awward-especial/add-awward-especial.component';
import {MatTabsModule} from '@angular/material/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatDialogModule} from '@angular/material/dialog';
import { EditAwardCatalogComponent } from './edit-award-catalog/edit-award-catalog.component';



@NgModule({
  declarations: [
    AwarCatalogComponent,
    AddAwarCatalogComponent,
    NormalComponent,
    EspecialComponent,
    AddAwwardEspecialComponent,
    EditAwardCatalogComponent
  ],
  imports: [
    CommonModule,
    AwarCatalogRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule,
    MatTabsModule,
    NgSelectModule,
    FormsModule,
    MatDialogModule
  ]
})
export class AwarCatalogModule { }
