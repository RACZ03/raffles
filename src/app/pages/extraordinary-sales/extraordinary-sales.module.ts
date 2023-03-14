import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraordinarySalesComponent } from './extraordinary-sales.component';
import { ExtraordinarySalesRoutingModule } from './extraordinary-sales-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SlickCarouselModule } from 'ngx-slick-carousel';



@NgModule({
  declarations: [
    ExtraordinarySalesComponent
  ],
  imports: [
    CommonModule,
    ExtraordinarySalesRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    SlickCarouselModule,
  ]
})
export class ExtraordinarySalesModule { }
