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
    //varaible booleana
    let isSuperAdmin = false;

  for (const item of identity.roles) {
   if(item.nombre == 'ROLE_SUPER_ADMIN'){
    isSuperAdmin = true;
   }
  }
   if(!isSuperAdmin){
    return this.connectionSvc.send('get', `ganador/porNegocio/${identity.idNegocio}`);
   }
   else{
    return this.connectionSvc.send('get', `ganador/todos`);
   }

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


}
