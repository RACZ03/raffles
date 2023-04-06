import { UsersModule } from './../../super-admin/users/users.module';
import { DataTablesModule } from 'angular-datatables';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessUsersComponent } from './business-users.component';
import { RouterModule } from '@angular/router';
import { BusinessUsersRoutingModule } from './business-users-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



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
    UsersModule,
    ThemeModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule
  ]
})
export class BusinessUsersModule { }
