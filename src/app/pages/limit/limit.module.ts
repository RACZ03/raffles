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
import { ChangelimitxrutaComponent } from './changelimitxruta/changelimitxruta.component';
import { ChangelimitxsellerComponent } from './changelimitxseller/changelimitxseller.component';
import { ChangeonelimitsComponent } from './changeonelimits/changeonelimits.component';
import { ChangelimitonesellerComponent } from './changelimitoneseller/changelimitoneseller.component';
import { ChangelimitoutlimitsComponent } from './changelimitoutlimits/changelimitoutlimits.component';
import { FreenumbertosellerComponent } from './freenumbertoseller/freenumbertoseller.component';
import { FreenumbertorouteComponent } from './freenumbertoroute/freenumbertoroute.component';
import { FreenumbertobisnessComponent } from './freenumbertobisness/freenumbertobisness.component';



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
    NgbModule
  ]
})
export class LimitModule { }
