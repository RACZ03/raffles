import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessUsersComponent } from './business-users.component';
import { AddBusinessUserComponent } from './add-business-user/add-business-user.component';
import { RouterModule } from '@angular/router';
import { BusinessUsersRoutingModule } from './business-users-routing.module';



@NgModule({
  declarations: [
    BusinessUsersComponent,
    AddBusinessUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BusinessUsersRoutingModule
  ]
})
export class BusinessUsersModule { }
