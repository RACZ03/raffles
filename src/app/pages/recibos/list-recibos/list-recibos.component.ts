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
import { ActivatedRoute, Router } from '@angular/router';
import { __values } from 'tslib';
import { SalesService } from 'src/app/@core/services/sales.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { PrintService } from 'src/app/@core/utils/print.service';

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
  public previousRouter: boolean = false;
  public previousRoute: string = '';
  public noMostrar: boolean = true;
  public Totales: any = '';

  public data: any = [];
  public search: string = '';
  public previousUrl: any;
  public dataSorteo: any = [];
  public dataIdentity: any = null;
  fechaInicio = new FormControl('',[Validators.required, this.fechaInicioValida]);
  selected = new FormControl('',[Validators.required]);

  public isSuperAdmin: boolean = false;
  public isAdmin: boolean = false;
  public isSupervisor: boolean = false;


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
    public winnerSvc : WinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private salesSvc : SalesService,
    private userSvc: UsersService,
    private printSvc: PrintService,
  ) {
    this.isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN') as boolean;
    this.isAdmin = this.userSvc.verifyRole('ROLE_ADMIN') as boolean;
    this.isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR') as boolean;
  }

  ngOnInit(): void {
    //validar el paramtro dentro de la ruta
    this.previousUrl ='';
     this.previousUrl = this.route.snapshot.params;
    //  console.log(this.previousUrl);
    if (this.previousUrl.return==1) {
      this.noMostrar = false;
    }
    if(this.previousUrl.return==2){
      this.previousRoute = '/pages/sales';
    }
    if(this.previousUrl.return==3){
      this.previousRoute = '/pages/extraordinary-sales';
    }
    // console.log(this.previousRoute);

    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.getCurrentRaflle();
    this.loadData(null);
    this.loadDataSorteo();

  }

  async loadData(_data:any){
    if(_data!=null){
      this.data = _data;
      this.dtTrigger.next(this.dtOptions);
    }else{
      this.currentRaffle = JSON.parse(localStorage.getItem('currentRaffle') || '{}');
      if(this.currentRaffle==false){
        this.alerSvr.showAlert(3,'Sorteo Actual',`No hay sorteo actual`);
      }

      // set value of date
      this.fechaInicio.setValue(moment().format('YYYY-MM-DD'));

      if(this.previousUrl.return==1 || this.previousUrl.return==2){
        let resp = await this.reporSvr.getRecibosActuales();

        // selected from value of select
        this.selected.setValue(this.currentRaffle.id);

        //console.log(resp);
        let { data,status, comment  } = resp;
        this.Totales = comment;
        if(status==200){
          this.data = data;
          this.dtTrigger.next(this.dtOptions);
        }
        else{
        this.data = _data;
        this.dtTrigger.next(this.dtOptions);
        }
      }else{
        let resp = await this.reporSvr.getRecibosActualesExtra();
        //console.log(resp);
        let { data,status, comment  } = resp;
        this.Totales = comment;
        if(status==200){
          this.data = data;
          this.dtTrigger.next(this.dtOptions);

          // selected from value of select
          if ( data.length > 0 ) {
           this.selected.setValue(data[0].idSorteo);
          }
        }
        else{
          this.data = _data;
          this.dtTrigger.next(this.dtOptions);
        }
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
    this.Totales = comment;
      if(status==200){
        if(data!=null){
          this.data = data;
          this.renderer(data);
        }else{
          this.alerSvr.showAlert(4,'Sin Datos',comment);
          this.data=data
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
   //  this.alerSvr.showAlert(1,'CIERRE DETALLE','se ha cerrado el modal de detalle');
    });
  }

  goBack() {
    this.router.navigate([this.previousRoute as string]);
  }

  limpiarFiltro(){
    this.fechaInicio.setValue('');
    this.selected.setValue('');
    this.loadData(null);
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

  async getCurrentRaflle() {
    let currentRaffle = await this.salesSvc.getCurrentRaffle();
    if (currentRaffle) {
      this.currentRaffle = currentRaffle;
    }
  }

  //eliminar
  async deleteVenta(_item:any){
    // console.log(_item);
    this.getCurrentRaflle();
    this.currentRaffle = JSON.parse(localStorage.getItem('currentRaffle') || '{}');
    let id = _item.id;
    let idvendedor = _item.vendedor.id;
    let idsorteo = _item.sorteo.id;
    let fecha = _item.fechaFormateada;
    let pasivo = _item.pasivo;
    let nombreSorteo = _item.sorteo.nombre;
    ///fecha today
    let fechaActual = moment().format('DD-MM-YYYY');
  //  console.log(_item);
    if(pasivo){
      return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que ya se encuentra eliminado');
    }
    if(fechaActual != fecha){
      return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que no es del dia de hoy');
    }

    // get value of select sorteo
    let idSorteo = this.selected.value;

    let find = this.dataSorteo.find((item:any) => item.id == idSorteo);

    if ( find.nombre == 'MAÑANA'|| find.nombre =='TARDE' ||find.nombre =='NOCHE' ) {
      if(this.currentRaffle.id != idsorteo){
        return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que no pertenece al sorteo actual');
      }
    } else {
      let sorteoExtra = JSON.parse(localStorage.getItem('currentRaffleExtra') || '{}');
      if ( sorteoExtra?.data?.id != idsorteo ) {
        return this.alerSvr.showAlert(4,'Error','No se puede eliminar un recibo que no pertenece al sorteo actual');
      }
    }
    let confirm = await this.alerSvr.showConfirm('Eliminar','¿Está seguro de eliminar el recibo?');

    if(confirm){
      if (nombreSorteo == 'MAÑANA'|| nombreSorteo =='TARDE' ||nombreSorteo =='NOCHE') {
        let resp = await this.reporSvr.deleteVenta(id,idvendedor);
        let { data,status, comment,  } = resp;

         if(status==200){
           this.alerSvr.showAlert(1,'Eliminado',comment);
           this.renderer(null);
         }
      }else{
        let resp = await this.reporSvr.eliminarventaExtra(id,idvendedor);
        let { data,status, comment,  } = resp;

         if(status==200){
           this.alerSvr.showAlert(1,'Eliminado',comment);
           this.renderer(null);
         }
      }
    }else{
      this.renderer(null);
    }
  }

 async printing(_item:any){
  let pasivo = _item.pasivo;
  if(pasivo){
    return this.alerSvr.showAlert(4,'Error','No se puede imprimir un recibo que ya se encuentra eliminado');
  }

  let confirm = await this.alerSvr.showConfirmLimit('Imprimir','¿Está seguro de imprimir el recibo?','Imprimir');
  if(confirm){
    let respTicket = await this.userSvc.verifyPrint();
    if (respTicket) {
      let { status, data } = respTicket;
      if (status == 200) {
        if ( data ) {
          this.getTickets(_item.codigo);
        }
      }
    }
  }else{
    this.alerSvr.showAlert(4,'Cancelado','Se cancelo la impresión');
  }

}

 async getTickets(code: string) {
   if ( navigator.bluetooth ) {
     try {
       if ( this.printSvc.device ) {
         this.printSvc.device.gatt.connect().then((server: any) => {
           return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
         })
         .then((service: any) => {
           service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb').then( async (characteristic: any) => {
             let resp = await this.salesSvc.getSaleByCode(code);
             let { status, data } = resp;
             if (status && status == 200) {
               let { status, data } = resp;
               let {
                 codigo,
                 vendedor,
                 ruta,
                 sorteo,
                 cantidadNumeros,
                 montoTotal,
                 fecha,
                 hora,
                 ventaDetalles,
               } = data;
               // convertir nombre de negocio a mayusculas
               let negocio = vendedor?.negocioAndRuta?.negocio.toUpperCase();
               // convertir nombre ruta a mayusculas
               ruta.nombre = ruta?.nombre.toUpperCase();
               // convertir nombre sorteo a mayusculas
               sorteo.nombre = sorteo?.nombre.toUpperCase();
               // convertir nombre vendedor a mayusculas
               vendedor = vendedor?.nombre.toUpperCase();
               // cambiar formato fecha a dd/mm/yyyy
               fecha = moment(fecha).format('DD/MM/YYYY');
               // cambiar formato hora a hh:mm a
               hora = moment(hora, 'HH:mm:ss').format('hh:mm a');
               let arrayPrint: string[] = [
                 negocio,
                 'RECIBO ' + codigo,
                 'RUTA ' + ruta?.nombre,
                 fecha + ' - ' + hora + ' - ' + sorteo?.nombre,
                 '',
                 '    NUMERO' + '  ' + 'MONTO' + '  ' + 'PREMIO',
               ];
               // ADD NUMBERS TO PRINT
               ventaDetalles.forEach((element: any) => {
                 arrayPrint.push('      ' + ( (element.numero <= 9)  ? element.numero + ' ' : element.numero ) + '      ' + ((element.monto <= 9 ) ? (element.monto + '      ') : ((element.monto <= 99) ? (element.monto + '     ') : (element.monto + '   ') )) + element.premio);
               });
               arrayPrint.push('');
               // ADD TOTAL TO PRINT
               arrayPrint.push(cantidadNumeros + ' NUMEROS VENDIDOS');
               arrayPrint.push(montoTotal + ' CORDOBAS');
               arrayPrint.push(vendedor);
               arrayPrint.push('');
               arrayPrint.push('Gracias por su compra. \nPor favor, conserve este recibo.\nNo se aceptan reclamos despues de 24 horas.\n\n');
               for (const iterator of arrayPrint) {
                 const element = iterator + '\n'; // Agregar un salto de línea al final
                 const encoder = new TextEncoder();
                 const data = encoder.encode(element);
                 await characteristic.writeValue(data);
               }
             }
           });
         }).catch((error: any) => {
          //  console.log('INFO:', error);
           this.printSvc.device = null;
           this.getTickets(code);
         });
       } else {
         navigator.bluetooth.requestDevice({
           filters: [{
             services: ['000018f0-0000-1000-8000-00805f9b34fb']
           }]
         })
         .then((device: any) => {
          //  console.log('Impresora encontrada:', device);
           // set device in localstorage
           this.printSvc.device = device;
           return device.gatt.connect();
         })
         .then((server: any) => {
           return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
         })
         .then((service: any) => {
           service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb').then( async (characteristic: any) => {
             let resp = await this.salesSvc.getSaleByCode(code);
             let { status, data } = resp;
             let {
               codigo,
               vendedor,
               ruta,
               sorteo,
               cantidadNumeros,
               montoTotal,
               fecha,
               hora,
               ventaDetalles,
             } = data;
             // convertir nombre ruta a mayusculas
             ruta.nombre = ruta?.nombre.toUpperCase();
             // convertir nombre sorteo a mayusculas
             sorteo.nombre = sorteo?.nombre.toUpperCase();
             // convertir nombre vendedor a mayusculas
             vendedor = vendedor?.nombre.toUpperCase();
             // cambiar formato fecha a dd/mm/yyyy
             fecha = moment(fecha).format('DD/MM/YYYY');
             // cambiar formato hora a hh:mm a
             hora = moment(hora, 'HH:mm:ss').format('hh:mm a');
             let arrayPrint: string[] = [
               '        RECIBO ' + codigo,
               '   RUTA: ' + ruta?.nombre,
               '' + fecha + ' - ' + hora + ' - ' + sorteo?.nombre,
               '',
               '    NUMERO' + '  ' + 'MONTO' + '  ' + 'PREMIO',
             ];
             // ADD NUMBERS TO PRINT
             ventaDetalles.forEach((element: any) => {
               arrayPrint.push('      ' + ( (element.numero <= 9)  ? element.numero + ' ' : element.numero ) + '      ' + ((element.monto <= 9 ) ? (element.monto + '      ') : ((element.monto <= 99) ? (element.monto + '     ') : (element.monto + '   ') )) + element.premio);
             });
             arrayPrint.push('');
             // ADD TOTAL TO PRINT
             arrayPrint.push('    ' + cantidadNumeros + ' NUMEROS VENDIDOS');
             arrayPrint.push('  TOTAL RECIBO :: ' + montoTotal + ' CORDOBAS');
             arrayPrint.push('    ' + vendedor);
             arrayPrint.push('');
             arrayPrint.push('Gracias por su compra. \nPor favor, conserve este recibo.\nNo se aceptan reclamos despues de 24 horas.\n\n');
             for (const iterator of arrayPrint) {
               const element = iterator + '\n'; // Agregar un salto de línea al final
               const encoder = new TextEncoder();
               const data = encoder.encode(element);
               await characteristic.writeValue(data);
             }
           });
         })
         .catch((error: any) => {
           // console.log('INFO:', error);
           this.printSvc.device = null;
           // this.getTickets(code);
         });
       }
     } catch (error) {
       this.printSvc.device = null;
       // console.log('tri catch error', error);
       // this.getTickets(code);
     }
   } else {
     let resp = await this.salesSvc.getSaleByCode(code);
     if (resp) {
       let { status, data } = resp;
       if (status && status == 200) {
         await this.printSvc.printTicket(data);
       }
     }
   }
 }
 connectBluetooth() {
   if ( navigator.bluetooth ) {
     if (this.printSvc.device) {
       this.printSvc.device = null;
     } else {
       // verificar permisos de bluetooth
       navigator.bluetooth.requestDevice({
         filters: [{
           services: ['000018f0-0000-1000-8000-00805f9b34fb']
         }]
       })
       .then((device: any) => {
         // console.log('Impresora encontrada:', device);
         // set device in localstorage
         this.printSvc.device = device;
         return device.gatt.connect();
       })
       .then((server: any) => {
         this.alerSvr.showAlert(1, 'Success', 'Impresora conectada');
         return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
       })
       .catch((error: any) => {
         this.printSvc.device = null;
         this.alerSvr.showAlert(3, 'Info', 'No se pudo conectar con la impresora');
       });
     }
   } else {
     this.alerSvr.showAlert(3, 'Info', 'Su navegador no soporta esta funcionalidad');
   }
 }


}
