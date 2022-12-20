import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showForm: boolean = false;
  public businessSelected: any = null;

  constructor(
    private businessService: BusinessService,
    private alertSvc: AlertService,
    private exportSvc: ExporterDataService
  ) { 
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 'Bfrtip',
      searching: true,
      search: false,
      info: false,
      language: {
        paginate: {
          first: "Primero",
          last: "Último",
          previous: "<",
          next: ">",
        }
      }
    };
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    this.data = [];
    let resp = await this.businessService.getBusiness();
    let { status, data } = resp;
    if ( status && status == 200) {
      this.data = data;
      // console.log(this.data)
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

  close(e: boolean) {
    if ( !e ) {
      this.showForm = false;
      return;
    }

    this.showForm = false;
    this.renderer();
    this.loadData();
  }

  async onDelete(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.businessService.delete(item.id);
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
