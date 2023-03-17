import { NgxMaskModule } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProfileComponent } from './business-profile.component';
import { RouterModule } from '@angular/router';
import { BusinessProfileRoutingModule } from './business-profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BusinessProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BusinessProfileRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxMaskModule
  ]
})
export class BusinessProfileModule { }
