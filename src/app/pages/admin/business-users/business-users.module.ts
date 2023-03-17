import { UsersModule } from './../../super-admin/users/users.module';
import { DataTablesModule } from 'angular-datatables';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessUsersComponent } from './business-users.component';
import { RouterModule } from '@angular/router';
import { BusinessUsersRoutingModule } from './business-users-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    BusinessUsersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BusinessUsersRoutingModule,
    DataTablesModule,
    TranslateModule,
    UsersModule
  ]
})
export class BusinessUsersModule { }
