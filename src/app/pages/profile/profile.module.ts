import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    ThemeModule,
    NgxMaskModule,
    TranslateModule
  ]
})
export class ProfileModule { }
