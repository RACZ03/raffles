import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { SupportRoutingModule } from './support-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    SupportComponent
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    ReactiveFormsModule,
    ThemeModule,
    TranslateModule
  ]
})
export class SupportModule { }
