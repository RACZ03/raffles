import { Injectable } from '@angular/core';
import { identity } from 'rxjs';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private dataIdentity: any = null;
  constructor(
    private connectionSvc: ConnectionService
  ) {
    this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
  }

  getRoute(): Promise<any> {
    return this.connectionSvc.send('get', `ruta`);
  }

  getRoutesByIdBusiness(id: number): Promise<any> {
    //console.log(id);
    return this.connectionSvc.send('get', `ruta/negocio/${ id }`);
  }

  add(data: any, isEdit: boolean = false): Promise<any> {

    let obj: any = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      idNegocio: (data.idNegocio == 0 ) ? this.dataIdentity.idNegocio : data.idNegocio
    }

    let params = JSON.stringify(obj);
    if (isEdit) {
      let { id } = data;
      return this.connectionSvc.send('put', `ruta/actualizar/${ id }`, params);
    } else {
      return this.connectionSvc.send('post', `ruta/guardar`, params);
    }
  }

  delete(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `ruta/eliminar/${ id }`);
  }


}
