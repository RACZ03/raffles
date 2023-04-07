import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject, identity } from 'rxjs';
import { ReportService } from 'src/app/@core/services/report.service';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-detalle-negocios',
  templateUrl: './detalle-negocios.component.html',
  styleUrls: ['./detalle-negocios.component.scss']
})
export class DetalleNegociosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

public data: any = [];
public mostrar: boolean = false;
public dataIdentity: any = null;
public search: string = '';
public dataSorteo: any = [];
fechaInicio = new FormControl('',[Validators.required, this.fechaInicioValida]);
fechaFin = new FormControl('',[Validators.required, this.fechaFinValida]);
selected = new FormControl('',[Validators.required]);


  constructor(
    private route: Router,
    private reportSvr: ReportService,
    private AlertSvc: AlertService,
    private winnerSvc: WinnerService,
    private dataTableSvc: DataTableServiceService,
    private exportSvc: ExporterDataService,
  ) { }

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

  async loadData(_data:any) {
    if(_data == null){
     let resp = await  this.reportSvr.getDetailbusiness();
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
      this.dtTrigger.next(this.dtOptions);
    }
  }

  returnLink() {
    this.route.navigate(['/report']);
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

   async report(){
    let fechaInicio = moment(this.fechaInicio.value).format('YYYY-MM-DD');
     let fechaFin = moment(this.fechaFin.value).format('YYYY-MM-DD');
     let idSorteo = this.selected.value;

   let resp = await this.reportSvr.getDetailSellerByBusinessFiltradoNegocio(fechaInicio=="Invalid date"? '': fechaInicio,
   fechaFin=="Invalid date"?'': fechaFin,idSorteo==null?'':idSorteo);
    let {data , comment, status} = resp;
     if(status == 200){
       if(data != null){
         this.data = data;
         this.fechaInicio.setValue('');
         this.fechaFin.setValue('');
         this.selected.setValue('')
       }else{
           this.AlertSvc.showAlert(3,'REPORTES VENDEDORES',comment);
           this.data=data;
           this.fechaInicio.setValue('');
           this.fechaFin.setValue('');
           this.selected.setValue('')
         }
       //  this.dataTableSvc.dtElements = this.dtElement;
         this.renderer(this.data);
       }

       this.clean();
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

     //limpiar campos
     clean(){
       this.fechaInicio.setValue('');
       this.fechaFin.setValue('');
       this.selected.setValue('');
       //this.renderer();
     }

     getFilteredData(): Promise<any[]> {
       return new Promise((resolve, _reject) => {
         this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
           const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
             return {
               'fecha': item[0],
               'inversionAlGanador': item[1],
               'numeroGanador': item[2],
               'premioTotal': item[3],
               'sorteo': item[4],
               'utilidad': item[5],
               'ventasTotales': item[6],

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
           'Inversion Al Ganador': item?.inversionalganador,
           'Numero Ganador': item?.numeroganador,
           'Premio Total': item?.premiototal,
           'Sorteo': item?.sorteo,
           'Utilidad': item?.utilidad,
           'Ventas Totales': item?.ventastotales
         }
       });
       this.exportSvc.exportToExcel(json, 'detalle Negocio');
     }

    async exportToPDF() {
       let data : any = [];
       if(this.search === ''){
         data = this.data;
       }else{
         data = await this.getFilteredData();
       }
       console.log(data);
       let json = data.map((item: any) => {

         return {
           'Fecha': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
           'Inversion Al Ganador': item?.inversionalganador,
           'Numero Ganador': item?.numeroganador,
           'Premio Total': item?.premiototal,
           'Sorteo': item?.sorteo,
           'Utilidad': item?.utilidad,
           'Ventas Totales': item?.ventastotales

         }
       });
       this.exportSvc.exportPdf(json, 'detalle Negocio',7,true);
     }

}
