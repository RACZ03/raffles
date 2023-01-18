import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitComponent } from './limit.component';
import { LimitRoutingModule } from './limit-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { AddLimitComponent } from './add-limit/add-limit.component';



@NgModule({
  declarations: [
    LimitComponent,
    AddLimitComponent
  ],
  imports: [
    CommonModule,
    LimitRoutingModule,
    TranslateModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule
  ]
})
export class LimitModule { }
