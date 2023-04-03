
import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { ROUTES_ADMIN, ROUTES_SALES, ROUTES_SUPERVISOR, ROUTES_SUPER_ADMIN } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles!: any[];
  public location: Location;
  public identity: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authService: AuthService,
    private userSvc: UsersService
  ) {
    this.location = location;
    this.identity = JSON.parse(localStorage.getItem('identity') || '{}');

    let isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
    let isAdmin = this.userSvc.verifyRole('ROLE_ADMIN');
    let isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR');

    if ( isSuperAdmin ) {
      this.listTitles = ROUTES_SUPER_ADMIN.filter(listTitle => listTitle);
    } else if ( isAdmin ) {
      this.listTitles = ROUTES_ADMIN.filter(listTitle => listTitle);
    } else if ( isSupervisor ) {
      this.listTitles = ROUTES_SUPERVISOR.filter(listTitle => listTitle);
    } else {
      this.listTitles = ROUTES_SALES.filter(listTitle => listTitle);
    }
  }

  ngOnInit() {
    // this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle(){
    var path = this.location.prepareExternalUrl(this.location.path());
    if(path.charAt(0) === '#'){
      path = path.slice( 1 );
    }
    let title = '';
    for(var item = 0; item < this.listTitles.length; item++){
      // remove /pages/ from path
      let pathWithoutPages = path.replace('/pages/', '');

      if(this.listTitles[item].path == pathWithoutPages) {
          title = this.listTitles[item].title;
          break;
      }
    }
    return title;
  }

  logout() {
    this.authService.logout('');
  }

}
