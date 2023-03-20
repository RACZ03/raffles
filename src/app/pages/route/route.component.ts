import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showFormRoute: boolean = false;
  public RouteSelected: any = null;
  public isAdmin: boolean|string = false;
  public search: string = '';

  constructor(
    private routeServ: RouteService,
    private alertSvc: AlertService,
    private dataTableSvc: DataTableServiceService,
    private usersSvc: UsersService,
    private exportSvc: ExporterDataService
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.isAdmin = this.usersSvc.verifyRole('ROLE_SUPER_ADMIN');
    this.loadData();
  }

  ngOnInit(): void {}

  async loadData() {
    this.data = [];
    let resp: any;
    if ( this.isAdmin )
      resp = await this.routeServ.getRoute();
    else
      resp = await this.routeServ.getRoutesByIdBusiness(this.usersSvc.getBusinessByAuth()?.idNegocio);

    // console.log(resp)
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
  addRoute() {
    this.dataTableSvc.dtElements = this.dtElement;
    this.showFormRoute = true;
  }

  onEditRoute(item: any) {
    this.dataTableSvc.dtElements = this.dtElement;
    this.RouteSelected = item;
    this.showFormRoute = true;
  }

  closeRoute(e: boolean) {

    this.showFormRoute = false;
    this.renderer();
  }

  async onDeleteRoute(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.routeServ.delete(item.id);
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
  this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    // new observable
    this.dtTrigger = new Subject();
    this.loadData();
  });
}

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    if ( this.dtElement != undefined ) {
      this.renderer();
    }
    this.dtTrigger.unsubscribe();
  }


  /* Export to Excel & PDF */
  getFilteredData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
          return {
            'nombre': item[0],
            'descripcion': item[1],
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
        'Descripción': item.descripcion,
      }
    });
    this.exportSvc.exportToExcel(json, 'rutas');
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
        'Descripción': item.descripcion,
      }
    });
    this.exportSvc.exportPdf(json, 'rutas', 2, false);
  }

}
