import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UsersService } from 'src/app/@core/services/users.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES_SUPER_ADMIN: RouteInfo[] = [
    { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'business', title: 'Negocio',  icon:'ni-building text-orange', class: '' },
    { path: 'business-setup', title: 'Configuración Negocio',  icon:'ni-building text-info', class: '' },
    { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '' },
    { path: 'users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
    { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
    { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
    {  path: 'report', title: 'Reportes', icon: 'ni-chart-bar-32 text-green', class: ''},
    { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
];

export const ROUTES_ADMIN: RouteInfo[] = [
    { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'business-profile', title: 'Negocio',  icon:'ni-building text-orange', class: '' },
    { path: 'business-setup', title: 'Configuración Negocio',  icon:'ni-building text-info', class: '' },
    { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '' },
    { path: 'business-users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
    { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
    { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
    { path: 'report', title: 'Reportes', icon: 'ni-chart-bar-32 text-green', class: ''},
    { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
];

export const ROUTES_SUPERVISOR: RouteInfo[] = [
  { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
];

export const ROUTES_SALES: RouteInfo[] = [
  { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: ''} ,
  { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: ''},
  { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
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
    let isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR');

    if ( isSuperAdmin ) {
      this.menuItems = ROUTES_SUPER_ADMIN;
    } else if ( isAdmin ) {
      this.menuItems = ROUTES_ADMIN;
    } else if ( isSupervisor ) {
      this.menuItems = ROUTES_SUPERVISOR;
    } else {
      this.menuItems = ROUTES_SALES;
    }
    // console.log('hi');
  }

  ngOnInit() {
    this.menuItems = this.menuItems.filter(menuItem => menuItem);
  }

  showMenu() {
    this.isCollapsed = false;
  }

  changeRoute() {
    this.isCollapsed = true;
  }

  logout() {
    this.authService.logout('');
  }

  // detectar el click fuera del sidebar
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // detectar si el click se realizo por una etiqueta a
    if (event.target.tagName === 'A') {
      this.isCollapsed = true;
    }
  }

}
