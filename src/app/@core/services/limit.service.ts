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

  // addOnBlur = true;
  // readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // numero: numero[] = [];

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();

  //   // Add our fruit
  //   if (value) {
  //     this.numero.push({ name: value });
  //   }

  //   // Clear the input value
  //   event.chipInput!.clear();
  // }

  // remove(numero: numero): void {
  //   const index = this.numero.indexOf(numero);

  //   if (index >= 0) {
  //     this.numero.splice(index, 1);
  //   }
  // }

  // edit(numero: numero, event: MatChipEditedEvent) {
  //   const value = event.value.trim();

  //   // Remove fruit if it no longer has a name
  //   if (!value) {
  //     this.remove(numero);
  //     return;
  //   }

  //   // Edit existing fruit
  //   const index = this.numero.indexOf(numero);
  //   if (index >= 0) {
  //     this.numero[index].name = value;
  //   }
  // }
 
}


export interface numero {
  name: string;
}