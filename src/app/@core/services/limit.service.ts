import { Injectable } from '@angular/core';
import { data } from 'jquery';
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

  changeLimiteNumberRoute(data: any): Promise<any> {
    return this.connectionSvc.send('put', `limite/cambiarLimitesDeNumerosDeRutas`, data);
  }

  changeLimiteNumberxSeller(data: any): Promise<any> {
    return this.connectionSvc.send('put', `limite/cambiarLimiteDeNumerosDeVendedores`, data);
  }

  changeoneLimit(data: any): Promise<any> {
    let { vendedor, numero, limite } = data;
    //console.log(numero);
    return this.connectionSvc.send('put', `limite/cambiarUnLimite?vendedor=${vendedor}&numero=${numero}&limite=${limite}`);
  }

  changelimitoneseller(data: any): Promise<any> {
    let { vendedor, limite } = data;
    return this.connectionSvc.send('put', `limite/cambiarTodosLosLimitesDeUnVendedor?vendedor=${vendedor}&limite=${limite}`);
  }

  freeNumberToSeller(data: any): Promise<any> {
   return this.connectionSvc.send('put', `limite/liberarNumerosParaVendedores`, data);
  } 

  freeNumberToRoute(data: any): Promise<any> {
    //console.log(data);
    return this.connectionSvc.send('put', `limite/liberarNumerosParaRutas`, data);
  }
 
  freeNumberToBusiness(data: any): Promise<any> {
    //console.log(data);
    return this.connectionSvc.send('put', `limite/liberarNumerosParaNegocios`, data);
  }

  changelimitsinafectarLimit(data:any ): Promise<any> {
    return this.connectionSvc.send('put', `limite/cambiarLimiteDeVendedoresSinAfectarLimitados`, data);
  }

 
}


export interface numero {
  name: string;
}