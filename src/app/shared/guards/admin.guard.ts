import { Injectable } from '@angular/core';
import { ActivatedRoute, CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/@core/services/users.service';
import { ROUTES_ADMIN, ROUTES_SALES, ROUTES_SUPERVISOR, ROUTES_SUPER_ADMIN } from 'src/app/@theme/components/sidebar/sidebar.component';

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
    this.isAdmin = this.userSvc.verifyRole('ROLE_ADMIN') as boolean;
    this.isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR') as boolean;
    this.isSales = this.userSvc.verifyRole('ROLE_VENDEDOR') as boolean;
    // if ( !this.isSuperAdmin ) {
    //   if ( !this.isAdmin ) {
    //     if ( !this.isSupervisor ) {
    //     }
    //   }
    // }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    // get route to load
    const routeToLoad = segments.map(segment => segment.path).join('/');
    let routeExists: boolean = false;
    if ( this.isSuperAdmin ) {
      // validate route to load if exists in const ROUTES_SUPER_ADMIN
      routeExists = ROUTES_SUPER_ADMIN.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    }
    if ( this.isAdmin ) {
      routeExists = ROUTES_ADMIN.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    }

    if ( this.isSupervisor ) {
      routeExists = ROUTES_SUPERVISOR.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    }

    if ( this.isSales ) {
      routeExists = ROUTES_SALES.find( route => route.path === routeToLoad ) !== undefined ? true : false;
    }

    // console.log('routeExists', routeExists);

    if ( !routeExists ) {
      // redirect to dashboard
      this.route.navigate(['/pages/dashboard']);
      return false;
    } else {
      return true;
    }
 }
}
