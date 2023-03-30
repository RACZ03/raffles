import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-negocios',
  templateUrl: './detalle-negocios.component.html',
  styleUrls: ['./detalle-negocios.component.scss']
})
export class DetalleNegociosComponent implements OnInit {

  public data: any = [];

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  returnLink() {
    this.route.navigate(['/report']);
  }

}
