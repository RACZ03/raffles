import { NgModule } from '@angular/core';
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

const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  SidebarComponent,
  AdminLayoutComponent
];

const DIRECTIVES = [
  ToggleTableDirective
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ]
})
export class ThemeModule { }
