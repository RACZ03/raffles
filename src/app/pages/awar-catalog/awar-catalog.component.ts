import { Component} from '@angular/core';

@Component({
  selector: 'app-awar-catalog',
  templateUrl: './awar-catalog.component.html',
  styleUrls: ['./awar-catalog.component.scss']
})
export class AwarCatalogComponent  {

  public title = '';
  constructor() {
    this.title = 'Catalogo de Premios';
  }
 
}
