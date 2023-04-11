import { Injectable } from '@angular/core';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { ROUTE_LIST } from 'src/app/@theme/components/sidebar/sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  constructor(
    private route: Router,
    private authSvc: AuthService,
    private userSvc: UsersService,
  ){
    // console.log('AdminGuard');
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    // get route to load
    const routeToLoad = segments.map(segment => segment.path).join('/');
    let routeExists: boolean = false;

    let list: any[] = [];

    let isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
    let isAdmin = this.userSvc.verifyRole('ROLE_ADMIN');
    let isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR');
    let isSales = this.userSvc.verifyRole('ROLE_VENDEDOR');

    if ( isSuperAdmin ) {
      // filter routes by role ROLE_SUPER_ADMIN AND ALL
      list = ROUTE_LIST.filter(item => item.role !== 'ROLE_VENDEDOR' && item.role !== 'ROLE_ADMIN' && item.role !== 'VENDEDOR&SUPERVISOR' ).sort((a, b) => a.order - b.order);
    } else if ( isSupervisor && isSales ) {
      // filter routes by role ALL AND ROLE_VENDEDOR
      list = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_VENDEDOR' || item.role === 'VENDEDOR&SUPERVISOR');
    } else if ( isAdmin && isSales ) {
      // filter routes by role ALL, ROLE_ADMIN, SUPER&ADMIN, ROLE_VENDEDOR
      list = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_ADMIN' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_VENDEDOR' || item.role === 'VENDEDOR&SUPERVISOR' );
    } else if ( isAdmin && isSupervisor &&isSales ) {
      // filter routes by role ALL, ROLE_ADMIN, SUPER&ADMIN, ROLE_VENDEDOR
      list = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'ROLE_ADMIN' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_VENDEDOR' || item.role === 'VENDEDOR&SUPERVISOR' );
    } else if ( isSupervisor ) {
      // filter routes by role ROLE_SUPERVISOR AND ALL
      list = ROUTE_LIST.filter(item => item.role === 'ROLE_SUPERVISOR' || item.role === 'VENDEDOR&SUPERVISOR' || item.role === 'ALL');
    } else if ( isAdmin ) {
      // filter routes by role ALL, SUPER&ADMIN AND ROLE_ADMIN
      list = ROUTE_LIST.filter(item => item.role === 'ALL' || item.role === 'SUPER&ADMIN' || item.role === 'ROLE_ADMIN');
    }
    else {
      // filter routes by role ROLE_VENDEDOR AND ALL
      list = ROUTE_LIST.filter(item => item.role === 'ROLE_VENDEDOR' || item.role === 'VENDEDOR&SUPERVISOR' || item.role === 'ALL');
    }

    // check if route exists
    routeExists = list.some(item => item.path === routeToLoad);

    // veriry if exists recibos in list
    // let isRecibosOrReport = list.some( item => item.path === 'recibos' || item.path === 'report' ) ? true : false;
    // verify if exists la palabra recibos in routeToLoad or report
    let isRecibosOrReport = routeToLoad.includes('recibos') || routeToLoad.includes('report') ? true : false;
    if ( isRecibosOrReport ) {
      // verify id routeToLoas is igual a recibos or recibos/recibos-normales or recibos/recibos-especiales
      return true;
    }

    if ( !routeExists ) {
      // redirect to dashboard
      this.route.navigate(['/pages/dashboard']);
      return false;
    } else {
      return true;
    }
 }
}
