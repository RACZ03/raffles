import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetalleVendedoresComponent } from './detalle-vendedores/detalle-vendedores.component';
import { DetalleRutasComponent } from './detalle-rutas/detalle-rutas.component';
import { ResumenVendedorFechaComponent } from './resumen-vendedor-fecha/resumen-vendedor-fecha.component';
import { DetalleNegociosComponent } from './detalle-negocios/detalle-negocios.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxTagsInputBoxModule } from 'ngx-tags-input-box';
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    ReportComponent,
    DetalleVendedoresComponent,
    DetalleRutasComponent,
    ResumenVendedorFechaComponent,
    DetalleNegociosComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    TagInputModule,
    NgxTagsInputBoxModule,
    FormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class ReportModule { }
