import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-modal-list-vendedores',
  templateUrl: './modal-list-vendedores.component.html',
  styleUrls: ['./modal-list-vendedores.component.scss']
})
export class ModalListVendedoresComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public search: string = '';
  public data: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModalListVendedoresComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private dataTableSvc: DataTableServiceService,
    private alerSvr : AlertService,
    private winnerSvr : WinnerService,
    private exportSvc: ExporterDataService
  ) {

    this.loadData(item);
  }

  ngOnInit(): void {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
  }

 async  loadData(_data: any) {
     let resp = await this.winnerSvr.getVendedoresPorGanadorNegocio(_data.idGanador,_data.idNegocio)
     let {data, status} = resp;
     console.log(data);
     if(status == 200){
       this.data = data;
     }else{
       //this.data = [];
       this.alerSvr.showAlert(1, 'Error', 'No se encontraron datos');
     }
     this.dtTrigger.next(this.dtOptions);
     // console.log(resp);

  }

  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  getFilteredData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
          return {
            'fecha': item[0],
            'sorteo': item[1],
            'ventasTotales': item[2],
            'numeroGanador': item[3],
            'inversionAlGanador': item[4],
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
        'Sorteo':item?.sorteo?.nombre,
        'Vendedor:': item?.vendedor?.nombre,
        'Ruta': item?.ruta?.nombre,
        'Numero Ganador':item?.numeroGanador,
        'Ventas Totales':item?.ventasTotales,
        'Premio Total':item?.premioTotal,
        'Utilidad':item?.utilidad
      }
    });
    this.exportSvc.exportToExcel(json, 'Datalle Ganadores por Vendedor');
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
        'Sorteo':item?.sorteo?.nombre,
        'Vendedor:': item?.vendedor?.nombre,
        'Ruta': item?.ruta?.nombre,
        'Numero Ganador':item?.numeroGanador,
        'Ventas Totales':item?.ventasTotales,
        'Premio Total':item?.premioTotal,
        'Utilidad':item?.utilidad
      }
    });
    this.exportSvc.exportPdf(json, 'Detalle Ganadores por Vendedor',7,true);
  }



}
