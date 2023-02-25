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
export class AwarCatalogComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  flag = 'normal';
  public dataNormal: any[] = [];
  public dataEspecial: any[] = [];

  public dataA: any[] = [];
  public showFormAward: boolean = false;
  public awardSelected: any = null;


  constructor(
    private awardServ: awarCatalogService,
    private alertSvc: AlertService,
    private dataTableSvc: DataTableServiceService
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();

  }

  ngOnInit(): void {
    this.dataTableSvc.dtElements = (this.dataTableSvc.dtElements!== undefined) ? this.dataTableSvc.dtElements : this.dtElement;
  }

  async loadData(band: boolean = false) {
    if ( band ) {
      this.render();
    } else {
      let resp = await this.awardServ.getAwardCatalog();
      // console.log(resp)
      this.dataNormal = [];
      this.dataEspecial = [];
      this.dataA=[];
      if ( resp !== undefined ) {
        let { status, data } = resp;
        if ( status && status == 200) {
        for (let i = 0; i < data.length; i++) {
            if(data[i].especial == false){
              this.dataNormal.push(data[i]);
            }else{
              this.dataEspecial.push(data[i]);
            }
          }
          // console.log(this.dataNormal)
          this.dataA = this.dataNormal;
          if(this.flag == 'especial'){
          this.flag = 'normal';
          }

        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }

      this.dtTrigger.next(this.dtOptions);
    }
  }

 async changeFlag(){
    if(this.flag == 'normal'){
      this.flag = 'especial';
      this.dataA=[];
      setTimeout(() => {
        this.dataA = this.dataEspecial;
        this.render2();
      }, 100);
    } else {
      this.flag = 'normal';
      this.dataA=[];
      setTimeout(() => {
        this.dataA = this.dataNormal;
        this.render2();
      }, 100);
    }

 }

  // Actions
  addAward() {
    this.dataTableSvc.dtElements = (this.dataTableSvc.dtElements!== undefined) ? this.dataTableSvc.dtElements : this.dtElement;
    this.showFormAward = true;
  }

  onEditAward(item: any) {
    this.dataTableSvc.dtElements = (this.dataTableSvc.dtElements!== undefined) ? this.dataTableSvc.dtElements : this.dtElement;
    this.awardSelected = item;
    this.showFormAward = true;
  }

  closeAward(e: boolean) {
    this.showFormAward = false;
    this.render();
  }

  async onDeleteAward(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.awardServ.delete(item.id);
      let { status } = resp;
      if ( status && status == 200) {
        this.alertSvc.showAlert(1, '', 'Registro eliminado');
      } else {
        this.alertSvc.showAlert(4, '', 'No se pudo eliminar el registro');
      }
    }
    this.dataTableSvc.dtElements = (this.dataTableSvc.dtElements!== undefined) ? this.dataTableSvc.dtElements : this.dtElement;
    this.render();
  }

   /* Search */
   searchData(e: any) {
    let value = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value).draw();
    });
  }

  /* Section Render & Destoy */
  render() {
    this.dtElement = (this.dtElement == undefined ) ? this.dataTableSvc.dtElements : this.dtElement;
    // unsubscribe the event
    this.dtTrigger.unsubscribe();
    // destroy the table
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // new observable
      this.dtTrigger = new Subject();
      this.loadData();
    });
  }

  render2() {
    // unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger = new Subject();
      this.dtOptions = {};
      this.dtOptions = this.dataTableSvc.dtOptions || {};
      this.dtTrigger.next(this.dtOptions);
    });
  }

  /* Destroy components */
  ngOnDestroy(): void {
    // this.render
    this.dtTrigger.unsubscribe();
  }


}
