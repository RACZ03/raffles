import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles!: any[];
  public location: Location;

  constructor(
    location: Location,  
    private element: ElementRef, 
    private router: Router,
    private authService: AuthService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
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
