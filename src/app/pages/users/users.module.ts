import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LimitHistoryComponent } from './limit-history/limit-history.component';



@NgModule({
  declarations: [
    UsersComponent,
    AddUserComponent,
    ChangePasswordComponent,
    LimitHistoryComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    NgbModule
  ]
})
export class UsersModule { }
