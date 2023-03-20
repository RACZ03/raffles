import { Component} from '@angular/core';

@Component({
  selector: 'app-awar-catalog',
  templateUrl: './awar-catalog.component.html',
  styleUrls: ['./awar-catalog.component.scss']
})
export class AwarCatalogComponent  {

  public title = '';
  public view = false;
  constructor() {
    this.title = 'Catalogo de Premios';
  }

  especialView(e : any){
    this.view = e;
  }
 
}
