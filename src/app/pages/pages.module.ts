import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    PagesComponent,
   
  ],
  imports: [
    CommonModule,
    ThemeModule,
    PagesRoutingModule,
    NgxMaskModule.forRoot(maskConfig),
  ]
})
export class PagesModule { }
