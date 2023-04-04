import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessSetupComponent } from './business-setup.component';
import { RoutingBusinessSetupModule } from './routing-business-setup.module';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    BusinessSetupComponent
  ],
  imports: [
    CommonModule,
    RoutingBusinessSetupModule,
    ThemeModule,
    DataTablesModule,
    NgSelectModule,
  ]
})
export class BusinessSetupModule { }
