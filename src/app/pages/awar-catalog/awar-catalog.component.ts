import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

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
