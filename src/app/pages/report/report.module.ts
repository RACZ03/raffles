import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { DetalleVendedoresComponent } from './detalle-vendedores/detalle-vendedores.component';
import { DetalleRutasComponent } from './detalle-rutas/detalle-rutas.component';
import { ResumenVendedorFechaComponent } from './resumen-vendedor-fecha/resumen-vendedor-fecha.component';
import { DetalleNegociosComponent } from './detalle-negocios/detalle-negocios.component';


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
    NgbModule
  ]
})
export class ReportModule { }
