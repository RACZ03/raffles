import { identity } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {

  constructor(
    private connectionSvc: ConnectionService,
  ) {

  }

  getIdentity(): any {
    let identity = localStorage.getItem('identity');
    if (identity) {
      return JSON.parse(identity);
    } else {
      return null;
    }
  }

  getwinners(): Promise<any> {
    //ganador/porNegocio/4
    let identity = this.getIdentity();
    let negocio = JSON.parse(localStorage.getItem('business') || '{}');
    //varaible booleana
    let isAdmin = false;

  for (const item of identity.roles) {
   if(item.nombre == 'ROLE_ADMIN'){
    isAdmin = true;
   }
  }
   if(isAdmin){
    return this.connectionSvc.send('get', `ganador/porNegocio/${negocio.idNegocio}`);
   }

    return this.connectionSvc.send('get', `ganador/todos`);

}

getwinnersByBusiness(idNegocio: any): Promise<any> {
  return this.connectionSvc.send('get', `ganador/porNegocio/${idNegocio}`);
}

  getSorteo(): Promise<any> {
    return this.connectionSvc.send('get', `sorteo/obtener`);
  }

  addWinner(data: any): Promise<any> {
    return this.connectionSvc.send('post', `ganador/agregar`, data);
  }

  verifywinner(fecha: any,sorteo:any): Promise<any> {
    return this.connectionSvc.send('get', `ganador/verificar/fecha/${fecha}/sorteo/${sorteo}`);
  }

  deleteWinner(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `ganador/eliminar/${id}`);
  }

  //ganador/vendedoresPorGanadorNegocio/7/1
  getVendedoresPorGanadorNegocio(idGanador: any, idNegocio: any): Promise<any> {
    return this.connectionSvc.send('get', `ganador/vendedoresPorGanadorNegocio/${idGanador}/${idNegocio}`);
  }

  //ganador/rutasPorGanadorNegocio/7/4
  getRutasPorGanadorNegocio(idGanador: any, idNegocio: any): Promise<any> {
    return this.connectionSvc.send('get', `ganador/rutasPorGanadorNegocio/${idGanador}/${idNegocio}`);
  }




}
