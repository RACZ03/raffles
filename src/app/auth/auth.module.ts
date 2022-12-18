import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(
      {
        timeOut: 2500,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }
    ), // ToastrModule added
  ]
})
export class AuthModule { }
