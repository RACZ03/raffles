import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/@core/services/report.service';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-resumen-vendedor-fecha',
  templateUrl: './resumen-vendedor-fecha.component.html',
  styleUrls: ['./resumen-vendedor-fecha.component.scss']
})
export class ResumenVendedorFechaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


public data: any = [];
public search: string = '';
public dataSorteo: any = [];
fechaInicio = new FormControl('',[Validators.required, this.fechaInicioValida]);
fechaFin = new FormControl('',[Validators.required, this.fechaFinValida]);
selected = new FormControl('',[Validators.required]);
  constructor(
    private reportSvr: ReportService,
    private AlertSvc: AlertService,
    private winnerSvc: WinnerService,
    private dataTableSvc: DataTableServiceService,
    private exportSvc: ExporterDataService,
  ) {

  }

  ngOnInit(): void {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData(null);
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
  async loadData(_data:any) {
    if(_data == null){
     let resp = await  this.reportSvr.getConsolidadoRango();
     let {data , comment, status} = resp;
     //console.log(resp);
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

 async report(){
   let fechaInicio = moment(this.fechaInicio.value).format('YYYY-MM-DD');
    let fechaFin = moment(this.fechaFin.value).format('YYYY-MM-DD');
    let idSorteo = this.selected.value;

  let resp = await this.reportSvr.getConsolidadoRangoByBusinessFiltrado(fechaInicio=="Invalid date"? '': fechaInicio,
  fechaFin=="Invalid date"?'': fechaFin);
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
    renderer(_data:any) {
      this.data = _data;
      this.dtElement = this.dataTableSvc.dtElements;
      // unsubscribe the event
      this.dtTrigger.unsubscribe();
      // destroy the table
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        // new observable
        this.dtTrigger = new Subject();
        this.loadData(this.data);
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
              'fecha_inicio': item[0],
              'fecha_fin': item[1],
              'inversion': item[2],
              'negocio': item[3],
              'nombre': item[4],
              'premio': item[5],
              'ruta': item[6],
              'utilidad': item[7],
              'ventas': item[8],
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
          'Fecha Inicio': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Fecha Fin': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Inversion': item?.inversion,
          'Negocio': item?.negocio,
          'Nombre': item?.nombre,
          'Premio': item?.premio,
          'Ruta': item?.ruta,
          'Utilidad': item?.utilidad,
          'Ventas': item?.ventas,
        }
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
      console.log(data);
      let json = data.map((item: any) => {

        return {
          'Fecha Inicio': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Fecha Fin': moment(item?.fecha).format('DD/MM/YYYY')== 'Invalid date' ? item?.fecha: moment(item?.fecha).format('DD/MM/YYYY'),
          'Inversion': item?.inversion,
          'Negocio': item?.negocio,
          'Nombre': item?.nombre,
          'Premio': item?.premio,
          'Ruta': item?.ruta,
          'Utilidad': item?.utilidad,
          'Ventas': item?.ventas,
        }
      });
      this.exportSvc.exportPdf(json, 'detalle vendedores',9,true);
    }

}
