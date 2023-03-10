import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from 'src/app/@theme/theme.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SalesRoutingModule } from './sales-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';



@NgModule({
  declarations: [
    SalesComponent,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    TranslateModule,
    ThemeModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxMaskModule,
    SlickCarouselModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SalesModule { }
