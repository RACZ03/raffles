import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-list-ganador',
  templateUrl: './list-ganador.component.html',
  styleUrls: ['./list-ganador.component.scss']
})
export class ListGanadorComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public showFormAddWinner: boolean = false;

  public data: any[] = [];

  constructor(
    private dataTableSvc: DataTableServiceService,
    private winnerSvc: WinnerService,
    private alertSvc: AlertService,
    private exportSvc: ExporterDataService
  ) { 
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    this.data = [];
    let resp = await this.winnerSvc.getwinners();
     let { data,status,message,comment } = resp;
     if(status==200){
        this.data = data;
      }else{
        this.alertSvc.showAlert(4,comment,message);
      }


    this.dtTrigger.next(this.dtOptions);
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
        this.renderer();
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
    this.renderer();
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

    /* Search */
    searchData(e: any) {
      let value = e.target.value;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search(value).draw();
      });
    }

    exportToExcel() {
      let json = this.data.map((item: any) => {
        return {
          'Fecha': moment(item?.fecha).format('DD/MM/YYYY'),
          'Sorteo':item?.sorteo?.nombre,
          'Ventas Totales':item?.ventasTotales,
          'Numero Ganador':item?.numeroGanador,
          'Inversion al Ganador':item?.inversionAlGanador,
          'Premio Total':item?.premioTotal, 
          'Utilidad':item?.utilidad 
        }
      });
      this.exportSvc.exportToExcel(json, 'negocios');
    }
  
    exportToPDF() {
      let json = this.data.map((item: any) => {
        return {
          'Fecha': moment(item?.fecha).format('DD/MM/YYYY'),
          'Sorteo':item?.sorteo?.nombre,
          'Ventas Totales':item?.ventasTotales,
          'Numero Ganador':item?.numeroGanador,
          'Inversion al Ganador':item?.inversionAlGanador,
          'Premio Total':item?.premioTotal, 
          'Utilidad':item?.utilidad 
        }
      });
      this.exportSvc.exportPdf(json, 'negocios');
    }

}
