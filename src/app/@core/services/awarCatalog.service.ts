import { Injectable } from '@angular/core';
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
   return this.connectionSvc.send('post', `catalogo-premio/guardar`, data);
  }

  delete(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `ruta/eliminar/${ id }`);
  }

  updateCatalogPremioxId(id: number, data: any): Promise<any> {
    return this.connectionSvc.send('put', `catalogo-premio/actualizar/${ id }`, data);
  }

  deleteAwardCatalog(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `catalogo-premio/eliminar/${ id }`);
  }
  
}
