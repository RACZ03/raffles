import { Injectable } from '@angular/core';
import { rolesList } from '../data/roles';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private connectionSvc: ConnectionService
  ) { }

  changeStatusPrinter(id: number): Promise<any> {
    return this.connectionSvc.send('put', `usuario/statusImprimeTicket/${ id }`);
  }

  verifyPrint(): Promise<any> {
    return this.connectionSvc.send('get', `usuario/statusImprimeTicket`);
  }

  getRolesByAuth(): any {
    return JSON.parse(localStorage.getItem('roles') || '') || [];
  }

  getBusinessByAuth(): any {
    return JSON.parse(localStorage.getItem('business') || '') || [];
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
    let rolesStorage = this.getRolesByAuth();
    let business = this.getBusinessByAuth();
    let id = business?.idNegocio || 0;
    let role_name = rolesStorage[0]?.nombre || '';
    let code = '';

    let role = rolesList.find((item: any) => item.ref === role_name);
    if ( role !== undefined ) {
      code = role?.code || '';
    }

    return { id, code };
  }

  getUsers(): Promise<any> {
    return this.connectionSvc.send('get', `usuario/all?page=1&size=10000`);
  }

  getUsersByBusinessAndRole(id: number, role: string): Promise<any> {
    return this.connectionSvc.send('get', `usuario/obtenerPorNegocioAndRol/${ id }/${ role }`);
  }

  getUsersByBusiness(id: number): Promise<any> {
    return this.connectionSvc.send('get', `usuario/obtenerPorNegocio/${ id }`);
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
      telefono: (data.telefono == '' || data.telefono == null || data.telefono == undefined ) ? null : data.telefono,
      email: (data.email == '' || data.email == null || data.email == undefined) ? null : data.email,
      password: data.password,
      idNegocio: parseInt(data.idNegocio),
      idRuta: (data.idRuta !==  0 ) ? data.idRuta : null,
      imprimeTicket: data?.imprimeTicket,
      tablaEspecial: data?.tablaEspecial,
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

  closeSessionByCode(codigo: string, id: string): Promise<any> {
    return this.connectionSvc.send('put', `api/public/logout/cod/${ codigo }/id/${ id }`);
  }

  enableOrDisabledUser(id: number): Promise<any> {
    return this.connectionSvc.send('put', `usuario/habilitar-inhabilitar/${ id }`);
  }

  addOrRole(phone: number, role: string, add: boolean = true ): Promise<any> {
    let params = {
      emailOrPhone: phone,
      nombreRol: role
    };

    if ( add )
      return this.connectionSvc.send('post', `rol/agregarRolAlUsuario`, JSON.stringify(params));
    else
      return this.connectionSvc.send('post', `rol/eliminarRolDelUsuario`, JSON.stringify(params));
  }

}
