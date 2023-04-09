import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanadorRoutingModule } from './ganador-routing.module';
import { ListGanadorComponent } from './list-ganador/list-ganador.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { TagInputModule } from 'ngx-chips';
import { NgxTagsInputBoxModule } from 'ngx-tags-input-box';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddwinnerComponent } from './addwinner/addwinner.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ModalListRutasComponent } from './modal-list-rutas/modal-list-rutas.component';
import { ModalListVendedoresComponent } from './modal-list-vendedores/modal-list-vendedores.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ListGanadorComponent,
    AddwinnerComponent,
    ModalListRutasComponent,
    ModalListVendedoresComponent
  ],
  imports: [
    CommonModule,
    GanadorRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    TagInputModule,
    NgxTagsInputBoxModule,
    FormsModule,
    NgbTooltip,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,

  ]
})
export class GanadorModule { }
