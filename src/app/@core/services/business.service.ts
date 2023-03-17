import { Injectable } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private connectionSvc: ConnectionService
  ) { }

  getById(id: number): Promise<any> {
    return this.connectionSvc.send('get', `negocio/${ id }`);
  }

  getBusiness(): Promise<any> {
    return this.connectionSvc.send('get', `negocio`);
  }

  add(data: any, isEdit: boolean = false): Promise<any> {
    let params = JSON.stringify(data);
    if (isEdit) {
      let { id } = data;
      return this.connectionSvc.send('put', `negocio/actualizar/${ id }`, params);
    } else {
      return this.connectionSvc.send('post', `negocio/guardar`, params);
    }
  }

  delete(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `negocio/eliminar/${ id }`);
  }

}
