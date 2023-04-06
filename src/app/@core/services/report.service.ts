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
    this.roles= JSON.parse(localStorage.getItem('roles') || '{}');
  }


getDetailSellerAllBusiness(): Promise<any> {
  //fecha de hoy
   return this.connectionSvc.send('get', `venta/detalle/vendedor?idNegocio=${this.dataIdentity.idNegocio}`);
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
   return this.connectionSvc.send('get', `venta/detalle/negocio`);
}

getDetailSellerByBusinessFiltradoNegocio(fechaInicio: string, fechaFin: string,idSorteo: string): Promise<any> {
  return this.connectionSvc.send('get', `venta/detalle/negocio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSorteo=${idSorteo}`);
}

//venta/detalle/ruta?idNegocio=1&fechaInicio=2022-12-12&fechaFin=2023-12-12&idSorteo=2
getDetailRoute(): Promise<any> {
  //fecha de hoy
  let today = new Date();
  let dd = parseInt(String(today.getDate()).padStart(2, '0'));
  let mm = parseInt(String(today.getMonth()).padStart(2, '0')); //January is 0!
  let yyyy = today.getFullYear();
  today = new Date(yyyy, mm, dd);
   return this.connectionSvc.send('get', `venta/detalle/ruta?idNegocio=${this.dataIdentity.idNegocio}`);
}

getDetailRouteByBusinessFiltrado(fechaInicio: string, fechaFin: string,idSorteo: string): Promise<any> {
  return this.connectionSvc.send('get', `venta/detalle/ruta?idNegocio=${this.dataIdentity.idNegocio}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idSorteo=${idSorteo}`);
}

//venta/consolidado/rango?idNegocio=1&inicio=2023-01-01&fin=2023-12-12
getConsolidadoRango(): Promise<any> {
  //fecha de hoy
  let rol = false;
  let today = new Date();
  let dd = parseInt(String(today.getDate()).padStart(2, '0'));
  let mm = parseInt(String(today.getMonth()).padStart(2, '0')); //January is 0!
  let yyyy = today.getFullYear();
  today = new Date(yyyy, mm, dd);

   return this.connectionSvc.send('get', `venta/consolidado/rango?idNegocio=${this.dataIdentity.idNegocio}`);
}

getConsolidadoRangoByBusinessFiltrado(fechaInicio: string, fechaFin: string): Promise<any> {
  return this.connectionSvc.send('get', `venta/consolidado/rango?idNegocio=${this.dataIdentity.idNegocio}&inicio=${fechaInicio}&fin=${fechaFin}`);
}

///venta/rpt-lista/fecha/2023-02-07/sorteo/1/vendedor/9
getRPTLista(_fecha: any, idSorteo: number, idVendedor: number): Promise<any> {
  let fecha = moment(_fecha).format('YYYY-MM-DD');
  return this.connectionSvc.send('get', `venta/rpt-lista/fecha/${fecha}/sorteo/${idSorteo}/vendedor/${idVendedor}`);

}

}
