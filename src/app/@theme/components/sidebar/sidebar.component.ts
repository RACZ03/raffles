import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UsersService } from 'src/app/@core/services/users.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    role: string;
    order: number;
}
export const ROUTE_LIST: RouteInfo[] = [
  { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '', role: 'ALL', order: 1 },
  { path: 'business', title: 'Negocio',  icon:'ni-building text-orange', class: '', role: 'ROLE_SUPER_ADMIN', order: 2 },
  { path: 'business-profile', title: 'Negocio',  icon:'ni-building text-orange', class: '', role: 'ROLE_ADMIN', order: 2 },
  { path: 'business-setup', title: 'Configuración Negocio',  icon:'ni-building text-info', class: '', role: 'SUPER&ADMIN',  order: 3 },
  { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '', role: 'SUPER&ADMIN', order: 4 },
  { path: 'users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '', role: 'ROLE_SUPER_ADMIN', order: 5 },
  { path: 'business-users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '', role: 'ROLE_ADMIN', order: 5 },
  { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '', role: 'SUPER&ADMIN', order: 6 },
  { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: '', role: 'SUPER&ADMIN', order: 7 } ,
  { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: '', role: 'SUPER&ADMIN', order: 8 } ,
  { path: 'report', title: 'Reportes', icon: 'ni-chart-bar-32 text-green', class: '', role: 'SUPER&ADMIN', order: 9 },
  { path: 'recibos/1', title: 'Recibos',  icon:'ni-tag text-primary', class: '', role: 'ALL', order: 10 },
  { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: '', role: 'ROLE_VENDEDOR', order: 11 } ,
  { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: '', role: 'ROLE_VENDEDOR', order: 12 },
];

export const ROUTES_ADMIN: RouteInfo[] = [
    // { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    // { path: 'business-profile', title: 'Negocio',  icon:'ni-building text-orange', class: '' },
    // { path: 'business-setup', title: 'Configuración Negocio',  icon:'ni-building text-info', class: '' },
    // { path: 'route', title: 'Rutas',  icon:'ni-square-pin text-default', class: '' },
    // { path: 'business-users', title: 'Usuarios',  icon:'ni-single-02 text-yellow', class: '' },
    // { path: 'award-catalog', title: 'Catálogo premio',  icon:'ni-collection text-info', class: '' },
    // { path: 'limit', title: 'Limite',  icon:'ni-ui-04 text-red', class: ''} ,
    // { path: 'winner', title: 'Ganadores',  icon:'ni-money-coins text-danger', class: ''} ,
    // { path: 'report', title: 'Reportes', icon: 'ni-chart-bar-32 text-green', class: ''},
    // { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
];

export const ROUTES_SUPERVISOR: RouteInfo[] = [
  // { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
    // { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
];

export const ROUTES_SALES: RouteInfo[] = [
  // { path: 'dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' },
  // { path: 'sales', title: 'Ventas',  icon:'ni-bullet-list-67 text-orange', class: ''} ,
  // { path: 'extraordinary-sales', title: 'Ventas Extraordinarias',  icon:'ni-bullet-list-67 text-default', class: ''},
  // { path: 'recibos', title: 'Recibos',  icon:'ni-tag text-primary', class: ''}
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
    private userSvc: UsersService,
  ) {
    let isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
    let isAdmin = this.userSvc.verifyRole('ROLE_ADMIN');
    let isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR');
    let isSales = this.userSvc.verifyRole('ROLE_VENDEDOR');

    if ( isSuperAdmin ) {
      // filter routes by role ROLE_SUPER_ADMIN AND ALL , order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role !== 'ROLE_VENDEDOR' && item.role !== 'ROLE_ADMIN' ).sort((a, b) => a.order - b.order);
    } else if ( isSupervisor && isSales ) {
      // filter routes by role ALL AND ROLE_VENDEDOR, order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_VENDEDOR').sort((a, b) => a.order - b.order);
    } else if ( isAdmin && isSales ) {
      // filter routes by role ALL, ROLE_ADMIN, SUPER&ADMIN, ROLE_VENDEDOR, order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_ADMIN' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_VENDEDOR').sort((a, b) => a.order - b.order);
    } else if ( isAdmin && isSupervisor &&isSales ) {
      // filter routes by role ALL, ROLE_ADMIN, SUPER&ADMIN, ROLE_VENDEDOR, order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_ADMIN' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_VENDEDOR').sort((a, b) => a.order - b.order);
    } else if ( isSupervisor ) {
      // filter routes by role ROLE_SUPERVISOR AND ALL , order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ROLE_SUPERVISOR' || item.role === 'ALL').sort((a, b) => a.order - b.order);
    } else if ( isAdmin ) {
      // filter routes by role ALL, SUPER&ADMIN AND ROLE_ADMIN , order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_ADMIN').sort((a, b) => a.order - b.order);
    }
    else {
      // filter routes by role ROLE_VENDEDOR AND ALL , order by order asc
      this.menuItems = ROUTE_LIST.filter(item => item.role === 'ROLE_VENDEDOR' || item.role === 'ALL').sort((a, b) => a.order - b.order);
    }

    this.authService.menuOptions = this.menuItems;
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
