import { Component, OnInit } from '@angular/core';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.scss']
})
export class EspecialComponent implements OnInit {

  public dataEspecial: any[] = [];

  public dataA: any[] = [];
  public showFormAward: boolean = false;


  constructor(
    private awardServ: awarCatalogService,
    private alertSvc: AlertService,
    private dataTableSvc: DataTableServiceService
  ) {
    
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(_band: boolean = false) {
    
      let resp = await this.awardServ.getAwardCatalog();
      this.dataEspecial = [];
      this.dataA=[];
      if ( resp !== undefined ) {
        let { status, data } = resp;
        if ( status && status == 200) {
          for (const item of data) {
            if(item.especial){
              this.dataEspecial.push(item);
            }
          }
          this.dataA = this.dataEspecial;

        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
  }

}
