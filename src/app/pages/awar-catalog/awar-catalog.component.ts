import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-awar-catalog',
  templateUrl: './awar-catalog.component.html',
  styleUrls: ['./awar-catalog.component.scss']
})
export class AwarCatalogComponent implements OnInit {

  public title = 'Catalogo de Premios';
  constructor() {}

  ngOnInit(): void { }
 
}
