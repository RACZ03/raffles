import { Injectable } from '@angular/core';
import { identity } from 'rxjs';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private dataIdentity: any = null;
  constructor(
    private connectionSvc: ConnectionService
  ) { 
    this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
  }
  
  getRoute(): Promise<any> {
    return this.connectionSvc.send('get', `ruta`);
  }

  add(data: any, isEdit: boolean = false): Promise<any> {
    
  let obj: any = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    idNegocio: this.dataIdentity.idNegocio
  }
  console.log(obj);
    
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
