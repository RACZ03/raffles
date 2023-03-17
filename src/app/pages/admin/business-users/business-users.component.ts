import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

declare var window: any;

@Component({
  selector: 'app-business-users',
  templateUrl: './business-users.component.html',
  styleUrls: ['./business-users.component.scss']
})
export class BusinessUsersComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showForm: boolean = false;

  public UserSelected: any = null;
  public isAdmin: boolean|string = false;

  public modalChangePassword: any;
  public modalHistory: any;

  constructor(
    private usersSvc: UsersService,
    private alertSvc: AlertService,
    private exportSvc: ExporterDataService,
    private dataTableSvc: DataTableServiceService
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.isAdmin = this.usersSvc.verifyRole('ROLE_SUPER_ADMIN');
    this.loadData();
  }

  ngOnInit(): void {
    this.modalChangePassword = new window.bootstrap.Modal(
      document.getElementById('changePasswordUser')
    );
    this.modalHistory = new window.bootstrap.Modal(
      document.getElementById('historyLimitUser')
    );
  }

  async loadData() {
    this.data = [];
    let resp: any;

    let { id, code } = this.usersSvc.getBusinessIdAndRoleCodeByAuth();
    resp = await this.usersSvc.getUsersByBusinessAndRole(id, code);
    console.log(resp)
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        this.data = data;
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
    this.UserSelected = item;
    this.showForm = true;
  }

  onChangePassword(item: any) {
    this.UserSelected = item;
    this.modalChangePassword.show();
  }

  onViewLimits(item: any) {
    this.UserSelected = item;
    this.modalHistory.show();
  }

  closeUser(e: boolean) {
    this.showForm = false;
    // refresh data
    this.UserSelected = null;
    this.renderer();
  }

  closeModal(e: any) {
    this.UserSelected = null;
    if (!e) {
      this.modalChangePassword.hide();
      return;
    } else {
      this.modalChangePassword.hide();
      this.renderer();
    }
  }

  closeModalHistory(e: any) {
    this.UserSelected = null;
    this.modalHistory.hide();
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
      // this.dataTableSvc.dtElements = this.dtElement;
      this.renderer();
    }
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
    this.dtElement = ( this.dtElement == undefined ) ? this.dataTableSvc.dtElements : this.dtElement;
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
