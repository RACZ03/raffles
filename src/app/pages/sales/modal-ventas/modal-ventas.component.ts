import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/@core/services/report.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

@Component({
  selector: 'app-modal-ventas',
  templateUrl: './modal-ventas.component.html',
  styleUrls: ['./modal-ventas.component.scss']
})
export class ModalVentasComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();



public data: any = [];
public search: string = '';
public dataSorteo: any = [];
public dataIdentity: any = null;
fechaInicio = new FormControl('',[Validators.required, this.fechaInicioValida]);
selected = new FormControl('',[Validators.required]);


  fechaInicioValida(control: FormControl): { [s: string]: boolean } {
    const fechaInicioIngresada = new Date(control.value);
    const fechaActual = new Date();
    if (fechaInicioIngresada > fechaActual) {
      return { fechaInicioValida: true };
    }
    return {};
  }

  constructor(
    public dialogRef: MatDialogRef<ModalVentasComponent>,
    public reporSvr: ReportService,
    private dataTableSvc: DataTableServiceService,
    private alerSvr : AlertService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(){
    let resp = await this.reporSvr.getRecibosActuales();
    console.log(resp);
      let { data } = resp;
  }

  report(){
    console.log('report');
  }

  limpiarFiltro(){
    console.log('limpiarFiltro');
  }

    /* Search */
    searchData(e: any) {
      this.search = e.target.value;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.search(this.search).draw();
      });
    }

}
