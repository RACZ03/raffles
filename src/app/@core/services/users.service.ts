import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { data } from 'jquery';
=======
import { rolesList } from '../data/roles';
>>>>>>> main
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

  getBusinessIdAndRoleCodeByAuth(): any {
    let roles = this.getRolesByAuth();
    let id = roles[0]?.idNegocio || 0;
    let code = roles[0]?.codigo || '';

    return { id, code };
  }

  getUsers(): Promise<any> {
    return this.connectionSvc.send('get', `usuario?page=1&size=10000`);
  }

  getUsersByBusinessAndRole(id: number, role: string): Promise<any> {
    return this.connectionSvc.send('get', `usuario/obtenerPorNegocioAndRol`, { idNegocio: id, rol: role });
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

    let role: string = data.role;
    let limite: number = data.limit;
    let path: string = '';

    if ( !isEdit ) {
      // veriry if role id is ROLE_SUPER_ADMIN
      let roles = rolesList;
      if ( isSuperAdmin ) {
        let roleSuperAdmin = roles.find((item: any) => item.ref === 'ROLE_SUPER_ADMIN');
        if ( roleSuperAdmin?.ref !== role ) {
          isSuperAdmin = false;
          let _role = roles.find((item: any) => item.ref === role);
          role = _role?.code || '';
        }
      } else {
        let _role = roles.find((item: any) => item.ref === role);
        role = _role?.code || '';
      }

      path = isSuperAdmin ? 'guardarSuperAdmin' : `guardarUsuario?rol=${ role }`;

    } else {
      obj.password = '';
    }

    if ( existsLimit) path = path + `&limite=${ limite }`;

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

  changePassword( id: number, data: any ): Promise<any> {
    let { password } = data;
    return this.connectionSvc.send('put', `usuario/actualizarPassword/${ id }?password=${ password }`);
  }
  

     getSellerxNegocio(): Promise<any> { 
        let idNegocio =JSON.parse(localStorage.getItem('business') || '{}').idNegocio;
        let rol='vendedor';
       return this.connectionSvc.send('get', `usuario/obtenerPorNegocioAndRol/${ idNegocio }/${ rol }`);
     }

  getLimitsBySeller(id: number): Promise<any> {
    return this.connectionSvc.send('get', `limite/obtener/${ id }`);
  }

}
