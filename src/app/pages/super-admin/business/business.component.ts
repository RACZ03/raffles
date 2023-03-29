import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showForm: boolean = false;
  public businessSelected: any = null;
  public search: string = '';

  constructor(
    private businessService: BusinessService,
    private alertSvc: AlertService,
    private exportSvc: ExporterDataService,
    private dataTableSvc: DataTableServiceService
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();
  }

  ngOnInit(): void {
    // console.log('ngOnInit')
  }

  async loadData() {
    this.data = [];
    let resp = await this.businessService.getBusiness();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        this.data = data;
        // console.log(this.data)
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
    } else {
      this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
    }
    this.dtTrigger.next(this.dtOptions);
  }

  // Actions
  add() {
    this.dataTableSvc.dtElements = this.dtElement;
    this.showForm = true;
  }

  onEdit(item: any) {
    this.dataTableSvc.dtElements = this.dtElement;
    this.businessSelected = item;
    this.showForm = true;
  }

  close(e: boolean) {
    this.showForm = false;
    this.renderer();
  }

  async onDelete(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.businessService.delete(item.id);
      let { status } = resp;
      if ( status && status == 200) {
        this.alertSvc.showAlert(1, '', 'Registro eliminado');
      } else {
        this.alertSvc.showAlert(4, '', 'No se pudo eliminar el registro');
      }
    }
    this.dataTableSvc.dtElements = this.dtElement;
    this.renderer();
  }


  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

  /* Section Render & Destoy */
  renderer() {
    this.dtElement = this.dataTableSvc.dtElements;
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

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }

  /* Export to Excel */
  getFilteredData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
          return {
            'nombre': item[1],
            'email': item[2],
            'telefono': item[3],
            'direccion': item[4],
          }
        });
        resolve(filteredData);
      });
    });
  }

  async exportToExcel() {
    let data: any = [];
    if ( this.search === '' ) {
      data = this.data;
    } else {
      // obtener los registros filtrados en el datatable
      data = await this.getFilteredData();
    }

    let json = data.map((item: any) => {
      return {
        'Nombre': item.nombre,
        'Email': item.email,
        'Teléfono': item.telefono,
        'Dirección': item.direccion,
      }
    });
    this.exportSvc.exportToExcel(json, 'negocios');
  }

  async exportToPDF() {
    let data: any = [];
    if ( this.search === '' ) {
      data = this.data;
    } else {
      // obtener los registros filtrados en el datatable
      data = await this.getFilteredData();
    }

    let json = data.map((item: any) => {
      return {
        'Nombre': item.nombre,
        'Email': item.email,
        'Teléfono': item.telefono,
        'Dirección': item.direccion,
      }
    });

    this.exportSvc.exportPdf(json, 'negocios', 4, false);
  }

}
