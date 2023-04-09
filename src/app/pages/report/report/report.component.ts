import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public showMenu: boolean = true;
  public mostrar = false;
  public mostrarAdminSuper = false;
  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
    this.validaRole();
    // validate if url contains /pages/report/ and hide menu
    if (this.route.url.includes('/pages/report/')) {
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }

    // detectar rutas hijas y ocultar el contenedor con id slidemenureport
    this.route.events.subscribe((val) => {
      if (this.route.url.includes('/pages/report/')) {
        this.showMenu = false;
      } else {
        this.showMenu = true;
      }
    });
  }

  validaRole() {
    let Roles = JSON.parse(localStorage.getItem('roles') || '{}');
    for (const item of Roles) {
      if(item.nombre == 'ROLE_SUPER_ADMIN'){
        this.mostrar = true;
        this.mostrarAdminSuper = true;
      }
      if(item.nombre == 'ROLE_ADMIN'){
        this.mostrarAdminSuper = true;
      }

    }
  }


}
