import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecibosRoutingModule } from './recibos-routing.module';
import { ListRecibosComponent } from './list-recibos/list-recibos.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { NgxTagsInputBoxModule } from 'ngx-tags-input-box';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalDetalleComponent } from './modal-detalle/modal-detalle.component';
import { RecibosComponent } from './recibos/recibos.component';
import { ListRecibosEspecialesComponent } from './list-recibos-especiales/list-recibos-especiales.component';


@NgModule({
  declarations: [
    ListRecibosComponent,
    ModalDetalleComponent,
    RecibosComponent,
    ListRecibosEspecialesComponent
  ],
  imports: [
    CommonModule,
    RecibosRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule,
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
    MatSelectModule,
    MatDialogModule
  ]
})
export class RecibosModule { }
