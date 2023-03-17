
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
  NavbarComponent,
  FooterComponent,
  SidebarComponent,
} from './components';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToggleTableDirective } from './directives/toggle-table.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrokenImagenDirective } from './directives/broken-imagen.directive';

const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  SidebarComponent,
  AdminLayoutComponent,
  SpinnerComponent,
];

const DIRECTIVES = [
  ToggleTableDirective,
  BrokenImagenDirective,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgxSpinnerModule,
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThemeModule { }
