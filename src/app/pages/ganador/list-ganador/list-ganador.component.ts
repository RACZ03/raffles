import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject, identity } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';
import { ModalListVendedoresComponent } from '../modal-list-vendedores/modal-list-vendedores.component';
import { ModalListRutasComponent } from '../modal-list-rutas/modal-list-rutas.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-list-ganador',
  templateUrl: './list-ganador.component.html',
  styleUrls: ['./list-ganador.component.scss']
})
export class ListGanadorComponent implements OnInit {
  @ViewChild('rutasSelect') selector!: NgSelectComponent;

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public showFormAddWinner: boolean = false;
  public mostrar: boolean = false;
  public search: string = '';
  public roles: any = null;
  public mostrarAdmin: boolean = false;
  public mostrarInChange: boolean = false;
  public ultimonegocio: any = null;
  public negocioSelected: any = null;
  public mostrarNegocio: boolean = false;
  public negocioSeleccionado: any = null;

  public data: any[] = [];
  public dataNegocio: any[] = [];
  public negocio: any = null;

  constructor(
    private dataTableSvc: DataTableServiceService,
    private winnerSvc: WinnerService,
    public alertSvc: AlertService,
    private exportSvc: ExporterDataService,
    public negocioSvr : BusinessService,
    public dialog: MatDialog,
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData(null);
  }

  ngOnInit(): void {
    this.roles= JSON.parse(localStorage.getItem('roles') || '{}');
    for (const item of this.roles) {
      if(item.nombre == 'ROLE_SUPER_ADMIN'){
        this.mostrar = true;
        this.loadDataNegocio();
      }
      if(item.nombre == 'ROLE_ADMIN'){
        this.mostrarAdmin = true;
      }
    }

  }

  async loadDataNegocio() {
    let resp = await this.negocioSvr.getBusiness();
    if(resp != undefined){
      let { data } = resp;
      this.dataNegocio = data;
       this.ultimonegocio = data[data.length-1];
      this.negocioSeleccionado=this.ultimonegocio;
    }
  }

  async loadData(_data: any) {
   if(_data==null){
    this.data = [];
    let resp = await this.winnerSvc.getwinners();

    if(resp != undefined){
     let { data,status,message,comment } = resp;
     if(status==200){
        this.data = data;
      }else{
        this.alertSvc.showAlert(3,'GANADORES',comment);
      }
    }else{
      this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
    }
    this.dtTrigger.next(this.dtOptions);
   }else{
    if(_data==null){
      this.data = [];
      let resp = await this.winnerSvc.getwinnersByBusiness(this.ultimonegocio.id);

      if(resp != undefined){
       let { data,status,message,comment } = resp;
       if(status==200){
          this.data = data;
        }else{
          this.alertSvc.showAlert(3,'GANADORES',comment);
        }
      }else{
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
      this.dtTrigger.next(this.dtOptions);
    }else{
      this.data = _data;
      this.dtTrigger.next(this.dtOptions);

    }}}

  onNegocioSeleccionado(e:any) {
    this.negocioSelected = null
    this.negocioSelected = e;

    this.buscarNegocio();
  }

  detalleVendedor(item:any){
    const dialogRef = this.dialog.open(ModalListVendedoresComponent,{
      data : item
    });

    dialogRef.afterClosed().subscribe(result => {
     // window.location.reload();
     //this.AlertSvc.showAlert(1,'CIERRE VENDEDORES','se ha cerrado el modal');
    });
  }

  detalleRutas(item:any){
    const dialogRef = this.dialog.open(ModalListRutasComponent,{
      data : item
    });

    dialogRef.afterClosed().subscribe(result => {
     // window.location.reload();
     //this.AlertSvc.showAlert(1,'CIERRE VENDEDORES','se ha cerrado el modal');
    });
  }

  ///para buscar los negocios
 async buscarNegocio(){
    //
    let busenessSelected = this.negocioSelected;

    let resp = await this.winnerSvc.getwinnersByBusiness(( busenessSelected.id == undefined ) ? busenessSelected : busenessSelected.id);
    let { data,status,message,comment } = resp;
    if(status==200){
      this.renderer2(data)
    }else{
      this.data = [];
      this.renderer2(null, false);
      this.alertSvc.showAlert(3,'GANADORES',comment);
    }
  }

  //elimnar ganador
  async deleteWinner(id: number) {
    let confirm = await this.alertSvc.showConfirm(
      'Eliminar ganador',
      '¿Está seguro de eliminar el ganador?'
    );
    if (!confirm) return this.alertSvc.showAlert(2, 'Cancelado', 'No se eliminó el ganador');

    let resp = await this.winnerSvc.deleteWinner(id);
      let { status, message, comment } = resp;
      if (status == 200) {
        this.alertSvc.showAlert(1, message, comment);
        this.dataTableSvc.dtElements = this.dtElement;
        this.renderer(null);
      } else {
        this.alertSvc.showAlert(4, comment, message);
      }
  }

  addWinner() {
    this.dataTableSvc.dtElements = this.dtElement;
    this.showFormAddWinner = true;
  }

   close(e: boolean) {
    this.showFormAddWinner = false;
    this.renderer(null);
  }
  /* Section Render & Destoy */
 async renderer(_data:any) {
    this.data = [];
    this.dtElement = ( this.dtElement == undefined ) ? this.dataTableSvc.dtElements : this.dtElement;

    // unsubscribe the event
    this.dtTrigger.unsubscribe();

    await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // new observable
      this.dtTrigger = new Subject();
      setTimeout(() => {
        this.loadData(_data);
      }, 200);
    });
  }

  async renderer2(_data:any, load: boolean = true) {

    await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

      if ( this.data.length != 0 ) {
        dtInstance.clear();
        dtInstance.draw();
        dtInstance.destroy();
      }

      this.data = [];
      if ( load )
      this.loadData(_data);

    });
  }

async verDetalleNegocio(){

  this.mostrarInChange = true;
  this.mostrar= false;
  this.mostrarAdmin= true;
  this.mostrarNegocio = true;
  // select change

  let resp = await this.winnerSvc.getwinnersByBusiness(this.ultimonegocio.id);
  let { data,status,message,comment } = resp;
  if(status==200){
    this.data = data;

    // selected options for select
    this.selector.select({ value: this.ultimonegocio.id, label: this.ultimonegocio.nombre });

    // this.renderer2(this.data);
  }else{
    this.alertSvc.showAlert(3,'GANADORES',comment);
  }

}

  regresaPrincipal(){
    this.mostrarInChange = false;
    this.mostrar= true;
    this.mostrarAdmin= false;
    this.mostrarNegocio = false;

    this.renderer2(null);
  }

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }

  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

  getFilteredData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
          return {
            'fecha': item[0],
            'sorteo': item[1],
            'numeroGanador': item[2],
            'inversionAlGanador': item[3],
            'ventasTotales': item[4],
            'premioTotal': item[5],
            'utilidad': item[6]
          }
        });
        resolve(filteredData);
      });
    });
  }

  async  exportToExcel() {
      let data : any = [];
      if(this.search === ''){
        data = this.data;
      }else{
        data= await this.getFilteredData();
      }
      let json = data.map((item: any) => {
        return {
          'Fecha': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Sorteo':item?.sorteo?.nombre == undefined ? item?.sorteo : item?.sorteo?.nombre,
          'Ganador': item?.numeroGanador,
          'Inversion':item?.inversionAlGanador,
          'Venta Total':item?.ventasTotales,
          'Premio':item?.premioTotal,
          'Utilidad':item?.utilidad
        }
      });
      this.exportSvc.exportToExcel(json, 'Numeros Ganadores');
    }

   async exportToPDF() {
      let data : any = [];
      if(this.search === ''){
        data = this.data;
      }else{
        data = await this.getFilteredData();
      }

      let json = data.map((item: any) => {

        return {
          'Fecha': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Sorteo':item?.sorteo?.nombre == undefined ? item?.sorteo : item?.sorteo?.nombre,
          'Ganador': item?.numeroGanador,
          'Inversion':item?.inversionAlGanador,
          'Venta Total':item?.ventasTotales,
          'Premio':item?.premioTotal,
          'Utilidad':item?.utilidad
        }
      });
      this.exportSvc.exportPdf(json, 'Numeros Ganadores',7,true);
    }



}
