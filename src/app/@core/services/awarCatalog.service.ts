import { Injectable } from '@angular/core';
import { identity } from 'rxjs';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class awarCatalogService {
  private dataIdentity: any = null;
  constructor(
    private connectionSvc: ConnectionService
  ) { 
    this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
  }
  
  ///catalogo-premio/negocio/4?especial=true
  getAwardCatalog(): Promise<any> {
    return this.connectionSvc.send('get', `catalogo-premio/negocio/${this.dataIdentity.idNegocio}`);
  }


  addAwarCatalogo(data: any, isEdit: boolean = false): Promise<any> {
    
//   let obj: any = {
//     nombre: data.nombre,
//     descripcion: data.descripcion,
//     idNegocio: this.dataIdentity.idNegocio
//   }
 // console.log(obj);
    
//      let params = JSON.stringify(obj);
//      if (isEdit) {
//        let { id } = data;
//        return this.connectionSvc.send('put', `ruta/actualizar/${ id }`, params);
//      } else {
//        return this.connectionSvc.send('post', `ruta/guardar`, params);
//   }
return this.connectionSvc.send('post', `catalogo-premio/guardar`, data);
  }

  delete(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `ruta/eliminar/${ id }`);
  }
}
