import { Injectable } from '@angular/core';
import { identity } from 'rxjs';
import { ConnectionService } from '../utils/connection.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private dataIdentity: any = null;
  private roles: any = null;

  constructor(
    private connectionSvc: ConnectionService
  ) {
    this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
  }


getDetailSellerAllBusiness(): Promise<any> {
  //fecha de hoy
  let today = new Date();
  let dd = parseInt(String(today.getDate()).padStart(2, '0'));
  let mm = parseInt(String(today.getMonth()).padStart(2, '0')); //January is 0!
  let yyyy = today.getFullYear();
  today = new Date(yyyy, mm, dd);
   return this.connectionSvc.send('get', `venta/detalle/vendedor?idNegocio=${this.dataIdentity.idNegocio}&fechaInicio=${moment(today).format('YYYY-MM-DD')}&fechaFin=${moment(today).format('YYYY-MM-DD')}`);
}

getDetailSellerByBusinessFiltrado(fechaInicio: string, fechaFin: string,idSorteo: string): Promise<any> {
  return this.connectionSvc.send('get', `venta/detalle/vendedor?idNegocio=${this.dataIdentity.idNegocio}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSorteo=${idSorteo}`);
}

///venta/detalle/negocio?fechaInicio=2023-01-01&fechaFin=2023-12-12&idSorteo=3
getDetailbusiness(): Promise<any> {
  //fecha de hoy
  let today = new Date();
  let dd = parseInt(String(today.getDate()).padStart(2, '0'));
  let mm = parseInt(String(today.getMonth()).padStart(2, '0')); //January is 0!
  let yyyy = today.getFullYear();
  today = new Date(yyyy, mm, dd);
   return this.connectionSvc.send('get', `venta/detalle/negocio?&fechaInicio=${moment(today).format('YYYY-MM-DD')}&fechaFin=${moment(today).format('YYYY-MM-DD')}`);
}

getDetailSellerByBusinessFiltradoNegocio(fechaInicio: string, fechaFin: string,idSorteo: string): Promise<any> {
  return this.connectionSvc.send('get', `venta/detalle/negocio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSorteo=${idSorteo}`);
}

}
