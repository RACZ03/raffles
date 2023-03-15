import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProfileComponent } from './business-profile.component';
import { RouterModule } from '@angular/router';
import { BusinessProfileRoutingModule } from './business-profile-routing.module';



@NgModule({
  declarations: [
    BusinessProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BusinessProfileRoutingModule
  ]
})
export class BusinessProfileModule { }
