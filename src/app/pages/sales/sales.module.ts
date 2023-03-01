import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesRoutingModule } from './sales-routing.module';



@NgModule({
  declarations: [
    SalesComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule
  ]
})
export class SalesModule { }
