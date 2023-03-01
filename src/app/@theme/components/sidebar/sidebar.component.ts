import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'business', title: 'Negocio',  icon:'ni-building text-orange', class: '' },
    { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '' },
    { path: 'users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
    { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
    { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-pink', class: ''} ,
    // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    // { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    // { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    // { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[] = [];
  public isCollapsed: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
