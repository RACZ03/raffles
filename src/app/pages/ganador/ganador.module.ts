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


@NgModule({
  declarations: [
    ListGanadorComponent
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
    NgSelectModule

  ]
})
export class GanadorModule { }
