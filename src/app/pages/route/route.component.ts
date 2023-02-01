import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { RouteService } from 'src/app/@core/services/route.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showFormRoute: boolean = false;
  public RouteSelected: any = null;

  constructor(
    private routeServ: RouteService,
    private alertSvc: AlertService,
  ) { 
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 't',
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
    let resp = await this.routeServ.getRoute();
   // console.log(resp)
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
  addRoute() {
    this.showFormRoute = true;
  }

  onEditRoute(item: any) {
    this.RouteSelected = item;
    this.showFormRoute = true;
  }

  closeRoute(e: boolean) {
    if ( !e ) {
      this.showFormRoute = false;
      return;
    }
    this.showFormRoute = false;
    if ( this.dtElement != undefined ) {
      this.renderer();
    }
    
    this.loadData();
  }

  async onDeleteRoute(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.routeServ.delete(item.id);
      let { status } = resp;
      if ( status && status == 200) {
        this.alertSvc.showAlert(1, '', 'Registro eliminado');
        if ( this.dtElement != undefined ) {
          this.renderer();
        }
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
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
   dtInstance.destroy();
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


}
