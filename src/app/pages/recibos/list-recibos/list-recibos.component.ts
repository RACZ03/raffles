import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/@core/services/report.service';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';

@Component({
  selector: 'app-list-recibos',
  templateUrl: './list-recibos.component.html',
  styleUrls: ['./list-recibos.component.scss']
})
export class ListRecibosComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

public currentRaffle: any = null;

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
    public reporSvr: ReportService,
    private dataTableSvc: DataTableServiceService,
    private alerSvr : AlertService,
    private dialog : MatDialog,
    public winnerSvc : WinnerService
  ) { }

  ngOnInit(): void {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData(null);
    this.loadDataSorteo();
  }

  async loadData(_data:any){
     if(_data!=null){
       this.data = _data;
       this.dtTrigger.next(this.dtOptions);
     }else{
      let resp = await this.reporSvr.getRecibosActuales();
      console.log(resp);
        let { data,status, comment  } = resp;
        if(status==200){
          this.data = data;
          this.dtTrigger.next(this.dtOptions);
        }
        else{
         this.data = _data;
         this.dtTrigger.next(this.dtOptions);
        }

     }
  }

 async report(){
    let fechaInicio = moment(this.fechaInicio.value).format('YYYY-MM-DD');
    let idSorteo = this.selected.value;
    if(fechaInicio == 'Invalid date'){
      return this.alerSvr.showAlert(4,'Error','Debe ingresar una fecha valida');
    }
    if(idSorteo == ''){
      return this.alerSvr.showAlert(4,'Error','Debe seleccionar un sorteo');
    }
     let resp = await this.reporSvr.getRecibos(fechaInicio,idSorteo);
     let { data,status, comment,  } = resp;
    // console.log(resp);
      if(status==200){
        if(data!=null){
          this.data = data;
          this.renderer(data);
        }else{
          this.alerSvr.showAlert(4,'Sin Datos',comment);
        }
      }
      else{
        this.data = [];
        }

  }

  async loadDataSorteo(){
    this.dataSorteo = [];
    let resp = await this.winnerSvc.getSorteo();
     let { data,status,message,comment } = resp;
     //console.log(resp);
    if(status==200){
       this.dataSorteo = data;
     }else{
       this.alerSvr.showAlert(4,comment,message);
     }
   }

  detalle(_item:any){
    const dialogRef = this.dialog.open(ModalDetalleComponent, {
      width: '700px',
      data: _item
    });

    dialogRef.afterClosed().subscribe(result => {
     // window.location.reload();
     this.alerSvr.showAlert(1,'CIERRE DETALLE','se ha cerrado el modal de detalle');
    });
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

  //eliminar
 async deleteVenta(_item:any){
    this.currentRaffle = JSON.parse(localStorage.getItem('currentRaffle') || '{}');
    let id = _item.id;
    let idvendedor = _item.vendedor.id;
    let idsorteo = _item.sorteo.id;
    let fecha = _item.fecha;
    let pasivo = _item.pasivo;
    ///fecha today
    let fechaActual = moment().format('YYYY-MM-DD');
    console.log(fechaActual);

    if(pasivo){
      return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que ya se encuentra eliminado');
    }
    if(fechaActual != fecha){
      return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que no es del dia de hoy');
    }
    if(this.currentRaffle.id != idsorteo){
      return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que no pertenece al sorteo actual');
    }

    let resp = await this.reporSvr.deleteVenta(id,idvendedor);
         let { data,status, comment,  } = resp;

          if(status==200){
            this.alerSvr.showAlert(1,'Eliminado',comment);
            this.renderer(null);
          }

  }


}
