import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showForm: boolean = false;
  public businessSelected: any = null;

  public UserSelected: any = null;

  constructor(
    private usersSvc: UsersService,
    private alertSvc: AlertService,
    private exportSvc: ExporterDataService,
    private dataTableSvc: DataTableServiceService
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    this.data = [];
    let resp = await this.usersSvc.getUsers();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        let { content } = data;
        this.data = content;
        console.log(this.data)
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

  closeUser(e: boolean) {
    this.showForm = false;
    // refresh data
    this.renderer();
  }

  async onDelete(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.usersSvc.delete(item.id);
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
    if ( !this.dtElement ) return;

    let value = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value).draw();
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
  exportToExcel() {
    let json = this.data.map((item: any) => {
      return {
        'Nombre': item.nombre,
        'email': item.email,
        'telefono': item.telefono,
        'direccion': item.direccion
      }
    });
    this.exportSvc.exportToExcel(json, 'negocios');
  }

  exportToPDF() {
    let json = this.data.map((item: any) => {
      return {
        'Nombre': item.nombre,
        'email': item.email,
        'telefono': item.telefono,
        'direccion': item.direccion
      }
    });
    this.exportSvc.exportPdf(json, 'negocios');
  }
}
