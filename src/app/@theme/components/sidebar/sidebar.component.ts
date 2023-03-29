import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UsersService } from 'src/app/@core/services/users.service';

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
    { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: ''} ,
    { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: ''} ,
    { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
];

export const ROUTES_ADMIN: RouteInfo[] = [
    { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'business-profile', title: 'Negocio',  icon:'ni-building text-orange', class: '' },
    { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '' },
    { path: 'business-users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
    { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
    { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: ''} ,
    { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: ''} ,
    { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
];

export const ROUTES_SALES: RouteInfo[] = [
  { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
  // { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
  // { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
  { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: ''} ,
  { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: ''} ,
  // { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[] = [];
  public isCollapsed: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userSvc: UsersService
  ) {
    let isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
    let isAdmin = this.userSvc.verifyRole('ROLE_ADMIN');

    if ( isSuperAdmin ) {
      this.menuItems = ROUTES;
    } else if ( isAdmin ) {
      this.menuItems = ROUTES_ADMIN;
    } else {
      this.menuItems = ROUTES_SALES;
    }
    console.log('hi');
  }

  ngOnInit() {
    this.menuItems = this.menuItems.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  changeRoute() {
    this.isCollapsed = true;
  }

  logout() {
    this.authService.logout('');
  }
}
