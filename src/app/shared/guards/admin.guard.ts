import { Injectable } from '@angular/core';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/@core/services/users.service';


declare interface RouteInfo {
  path: string;
}

const ROUTES_SUPER_ADMIN: RouteInfo[] = [
  { path: 'dashboard' },
  { path: 'business' },
  { path: 'business-setup' },
  { path: 'route' },
  { path: 'users' },
  { path: 'award-catalog' },
  { path: 'limit' } ,
  { path: 'winner' } ,
  {  path: 'report' }
];

const ROUTES_ADMIN: RouteInfo[] = [
  { path: 'dashboard' },
  { path: 'business-profile' },
  { path: 'business-setup' },
  { path: 'route' },
  { path: 'business-users' },
  { path: 'award-catalog' },
  { path: 'limit' } ,
  { path: 'winner' } ,
  { path: 'report' }
];

const ROUTES_SUPERVISOR: RouteInfo[] = [
  { path: 'dashboard' },
];

const ROUTES_SALES: RouteInfo[] = [
  { path: 'dashboard' },
  { path: 'sales' } ,
  { path: 'extraordinary-sales' }
];

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {

  public isSuperAdmin: boolean = false;
  public isAdmin: boolean = false;
  public isSupervisor: boolean = false;
  public isSales: boolean = false;

  constructor(
    private userSvc: UsersService,
    private route: Router
  ){
    this.isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN') as boolean;
    if ( !this.isSuperAdmin ) {
      this.isAdmin = this.userSvc.verifyRole('ROLE_ADMIN') as boolean;
      if ( !this.isAdmin ) {
        this.isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR') as boolean;
        if ( !this.isSupervisor ) {
          this.isSales = this.userSvc.verifyRole('ROLE_SALES') as boolean;
        }
      }
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    // get route to load
    const routeToLoad = segments.map(segment => segment.path).join('/');
    let routeExists: boolean = false;
    if ( this.isSuperAdmin ) {
      // validate route to load if exists in const ROUTES_SUPER_ADMIN
      routeExists = ROUTES_SUPER_ADMIN.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    } else if ( this.isAdmin ) {
      routeExists = ROUTES_ADMIN.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    } else if ( this.isSupervisor ) {
      routeExists = ROUTES_SUPERVISOR.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    } else if ( this.isSales ) {
      routeExists = ROUTES_SALES.find( route => route.path === routeToLoad ) !== undefined ? true : false;
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
