import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <!-- Spinner -->
    <!-- Sidenav -->
    <app-sidebar></app-sidebar>
    <div class="main-content">
      <app-spinner></app-spinner>
      <!-- Top navbar -->
      <app-navbar></app-navbar>
      <!-- Pages -->
      <router-outlet></router-outlet>
      <div class="container-fluid">
        <app-footer></app-footer>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
