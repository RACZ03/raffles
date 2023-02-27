import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitComponent } from './limit.component';
import { LimitRoutingModule } from './limit-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { ChangelimitxrutaComponent } from './changelimitxruta/changelimitxruta.component';
import { ChangelimitxsellerComponent } from './changelimitxseller/changelimitxseller.component';
import { ChangeonelimitsComponent } from './changeonelimits/changeonelimits.component';
import { ChangelimitonesellerComponent } from './changelimitoneseller/changelimitoneseller.component';
import { ChangelimitoutlimitsComponent } from './changelimitoutlimits/changelimitoutlimits.component';
import { FreenumbertosellerComponent } from './freenumbertoseller/freenumbertoseller.component';
import { FreenumbertorouteComponent } from './freenumbertoroute/freenumbertoroute.component';
import { FreenumbertobisnessComponent } from './freenumbertobisness/freenumbertobisness.component';
import { TagInputModule } from 'ngx-chips';
import { NgxTagsInputBoxModule } from 'ngx-tags-input-box';
import { NgSelectModule } from '@ng-select/ng-select';





@NgModule({
  declarations: [
    LimitComponent,
    ChangelimitxrutaComponent,
    ChangelimitxsellerComponent,
    ChangeonelimitsComponent,
    ChangelimitonesellerComponent,
    ChangelimitoutlimitsComponent,
    FreenumbertosellerComponent,
    FreenumbertorouteComponent,
    FreenumbertobisnessComponent,

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
    TagInputModule,
    NgxTagsInputBoxModule,
    FormsModule,
    NgSelectModule
  ]
})
export class LimitModule { }
