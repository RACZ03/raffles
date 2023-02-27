import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private connectionSvc: ConnectionService
  ) { }
  
  getRolesByAuth(): any {
    return JSON.parse(localStorage.getItem('roles') || '') || [];
  }

  verifyRole(found: string, b: boolean = true): boolean|string {
    let roles = this.getRolesByAuth();
    let role = roles.find((item: any) => item.nombre === found);

    if ( b ) 
      return role !== undefined;
    else
      return role;
  }

  getUsers(): Promise<any> {
    return this.connectionSvc.send('get', `usuario?page=1&size=10000`);
  }

  findById(id: number): Promise<any> {
    return this.connectionSvc.send('get', `usuario/${ id }`);
  }

  findByPhone(phone: string): Promise<any> {
    return this.connectionSvc.send('get', `usuario/obtenerPorTelefono/${ phone }`);
  }

  add( data: any, isSuperAdmin: boolean|string = false, isEdit: boolean = false, existsLimit: boolean = false ): Promise<any> {

    let obj = {
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      password: data.password,
      idNegocio: data.idNegocio,
      idRuta: data.idRuta,
    }

    let role: string = data.rol;
    let limite: number = data.limite;

    let path = isSuperAdmin ? 'guardarSuperAdmin' : `guardarUsuario?rol=${ role }`;
    if ( existsLimit) 
      path = path + `&limite=${ limite }`; 

    let params = JSON.stringify(obj);

    if (isEdit) {
      let { id } = data;
      return this.connectionSvc.send('put', `usuario/actualizar/${ id }`, params);
    } else {
      return this.connectionSvc.send('post', `usuario/${ path }`, params);
    }
  }

  delete(id: number): Promise<any> {
    return this.connectionSvc.send('delete', `usuario/eliminar/${ id }`);
  }
  
  changePassword( id: number, password: string ): Promise<any> {
    return this.connectionSvc.send('put', `usuario/actualizarPassword/${ id }?password=${ password }`);
  }
  

     getSellerxNegocio(): Promise<any> { 
        let idNegocio =JSON.parse(localStorage.getItem('business') || '{}').idNegocio;
        let rol='vendedor';
       return this.connectionSvc.send('get', `usuario/obtenerPorNegocioAndRol/${ idNegocio }/${ rol }`);
     }

}
