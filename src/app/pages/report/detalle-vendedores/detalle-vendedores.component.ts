import { AlertService } from 'src/app/@core/utils/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/@core/services/report.service';
import { FormControl, Validators } from '@angular/forms';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import * as moment from 'moment';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';
import { MatDialog } from '@angular/material/dialog';
import { RptListaModalComponent } from '../rpt-lista-modal/rpt-lista-modal.component';

@Component({
  selector: 'app-detalle-vendedores',
  templateUrl: './detalle-vendedores.component.html',
  styleUrls: ['./detalle-vendedores.component.scss']
})
export class DetalleVendedoresComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

public mostrar: boolean = false;
public data: any = [];
public search: string = '';
public dataSorteo: any = [];
public dataIdentity: any = null;
fechaInicio = new FormControl('',[Validators.required, this.fechaInicioValida]);
fechaFin = new FormControl('',[Validators.required, this.fechaFinValida]);
selected = new FormControl('',[Validators.required]);
  constructor(
    private reportSvr: ReportService,
    private AlertSvc: AlertService,
    private winnerSvc: WinnerService,
    private dataTableSvc: DataTableServiceService,
    private exportSvc: ExporterDataService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.dataIdentity= JSON.parse(localStorage.getItem('roles') || '{}');
    for (const item of this.dataIdentity) {
      if(item.nombre == 'ROLE_SUPER_ADMIN'){
        this.mostrar = true;
      }
    }

    this.loadData(null);
    this.loadDataSorteo();
  }

   fechaInicioValida(control: FormControl): { [s: string]: boolean } {
     const fechaInicioIngresada = new Date(control.value);
     const fechaActual = new Date();
     if (fechaInicioIngresada > fechaActual) {
       return { fechaInicioValida: true };
     }
     return {};
   }

   fechaFinValida(control: FormControl): { [s: string]: boolean } {
     const fechaFinIngresada = new Date(control.value);

     const fechaActual = new Date();
     if (fechaFinIngresada > fechaActual) {
       return { fechaFinInvalida: true };
     }
     return {};
   }

  async loadDataSorteo(){
    this.dataSorteo = [];
    let resp = await this.winnerSvc.getSorteo();
     let { data,status,message,comment } = resp;
    if(status==200){
       this.dataSorteo = data;
     }else{
       this.AlertSvc.showAlert(4,comment,message);
     }
   }

  async loadData(_data:any) {
    if(_data == null){
     let resp = await  this.reportSvr.getDetailSellerAllBusiness();
     let {data , comment, status} = resp;
      console.log(resp);
      if(status == 200){
       if(data != null){
         this.data = data;
       }else{
          this.AlertSvc.showAlert(3,'REPORTES VENDEDORES',comment);
        }
      }
      this.dtTrigger.next(this.dtOptions);
    }else{
      this.data = _data;
      // construir nuevamente el datatable
      this.dtTrigger.next(this.dtOptions);

    }
    // this.dataTableSvc.dtElements = this.dtElement;
  }

  async report(){
    let fechaInicio = moment(this.fechaInicio.value).format('YYYY-MM-DD');
    let fechaFin = moment(this.fechaFin.value).format('YYYY-MM-DD');
    let idSorteo = this.selected.value;

    let resp = await this.reportSvr.getDetailSellerByBusinessFiltrado(fechaInicio=="Invalid date"? '': fechaInicio,
    fechaFin=="Invalid date"?'': fechaFin,idSorteo==null?'':idSorteo);
    let {data , comment, status} = resp;
      if(status == 200){
        if(data != null){
          this.data = data;
        }else{
          this.AlertSvc.showAlert(3,'REPORTES VENDEDORES',comment);
          this.data=data;
        }
      //this.dataTableSvc.dtElements = this.dtElement;
      //this.dtElement = this.dataTableSvc.dtElements;
        this.renderer(this.data);
      }
  }

  detalleRPT(item:any){
    const dialogRef = this.dialog.open(RptListaModalComponent,{
      width: '500px',
      data : item
    });

    dialogRef.afterClosed().subscribe(result => {
     // window.location.reload();
     //this.AlertSvc.showAlert(1,'CIERRE VENDEDORES','se ha cerrado el modal');
    });
  }

  /* Section Render & Destoy */
  async renderer(_data:any) {
    this.data = [];

    await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.draw();
      dtInstance.destroy();
      this.loadData(_data);
    });
  }

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }

  limpiarFiltro(){
    this.clean();
    this.renderer(null);
  }

  //limpiar campos
  clean(){
    this.fechaInicio.setValue('');
    this.fechaFin.setValue('');
    this.selected.setValue('');
    //this.renderer();
  }

  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

  getFilteredData(): Promise<any[]> {
    return new Promise((resolve, _reject) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
          let obj: any = {};
          if ( this.mostrar) {
            obj = {
              fecha: item[0],
              sorteo: item[1],
              negocio: item[2],
              ruta: item[3],
              vendedor: item[4],
              numeroganador: item[5],
              ventastotales: item[6],
              premiototal: item[7],
              utilidad: item[8],
            }
          } else {
            obj = {
              fecha: item[0],
              sorteo: item[1],
              ruta: item[2],
              vendedor: item[3],
              numeroganador: item[4],
              ventastotales: item[5],
              premiototal: item[6],
              utilidad: item[7],
            }
          }
          return obj;
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
      return this.createObj(item);
    });
    this.exportSvc.exportToExcel(json, 'detalle de vendedores');
  }

  async exportToPDF() {
    let data : any = [];
    if(this.search === ''){
      data = this.data;
    }else{
      data = await this.getFilteredData();
    }
    // console.log(data);
    let json = data.map((item: any) => {
      return this.createObj(item);
    });
    let count =  this.mostrar ? 9 : 8;
    this.exportSvc.exportPdf(json, 'detalle vendedores', count,true);
  }

  createObj( item: any ) {
    let objTemp = {
      'Ruta': item?.ruta,
      'Vendedor': item?.vendedor,
      'Ganador': item?.numeroganador,
      'Ventas Totales': item?.ventastotales,
      'Premio Total': item?.premiototal,
      'Utilidad': item?.utilidad,
    };
    let obj: any = {};
    if ( this.mostrar ) {
      obj = {
        'Fecha': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
        'Sorteo': item?.sorteo,
        'Negocio': item?.negocio,
        ...objTemp
      };
    } else {
      obj = {
        'Fecha': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
        'Sorteo': item?.sorteo,
        ...objTemp
      }
    }
    return obj;
  }


}
