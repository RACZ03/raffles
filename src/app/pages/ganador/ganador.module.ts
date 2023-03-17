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


@NgModule({
  declarations: [
    ListGanadorComponent,
    AddwinnerComponent
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
export class GanadorModule { }
