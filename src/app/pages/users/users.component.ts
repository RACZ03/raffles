import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

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
    private exportSvc: ExporterDataService
  ) { 
    this.dtOptions = environment.dtOptions;
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
    this.showForm = true;
  }

  onEdit(item: any) {
    this.businessSelected = item;
    this.showForm = true;
  }

  closeUser(e: boolean) {
    if ( !e ) {
      this.showForm = false;
      return;
    }
    this.showForm = false;
    if ( this.dtElement != undefined ) {
      this.renderer();
    }
    
    this.loadData();
  }

  async onDelete(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.usersSvc.delete(item.id);
      let { status } = resp;
      if ( status && status == 200) {
        this.alertSvc.showAlert(1, '', 'Registro eliminado');
        this.renderer();
        this.loadData();
      } else {
        this.alertSvc.showAlert(4, '', 'No se pudo eliminar el registro');
      }
    }
  }


  /* Search */
  searchData(e: any) {
    let value = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value).draw();
    });
  }

  /* Section Render & Destoy */
  renderer() {
    if ( !this.dtElement ) return;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
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
