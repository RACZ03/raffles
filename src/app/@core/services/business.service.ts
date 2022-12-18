import { Injectable } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private connectionSvc: ConnectionService
  ) { }
  
  getBusiness(): Promise<any> {
    return this.connectionSvc.send('get', `negocio`);
  }

  add(data: any): Promise<any> {
    let params = JSON.stringify(data);
    return this.connectionSvc.send('post', `negocio/guardar`, params);
  }
}
