import { Injectable } from '@angular/core';
import { identity } from 'rxjs';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private dataIdentity: any = null;
  private roles: any = null;

  constructor(
    private connectionSvc: ConnectionService
  ) {
    this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
    this.roles = JSON.parse(localStorage.getItem('roles') || '{}');
    for (const item of this.roles) {
        if(item.nombre === 'ROLE_SUPER_ADMIN'){
         console.log('es super admin');
        }
    }
  }


getDetailSeller(): Promise<any> {
    ///venta/detalle/vendedor?idNegocio=1&fechaInicio=2023-12-12&fechaFin=2023-12-12&idSorteo=2
    console.log(this.dataIdentity);
    console.log(this.roles);
   return this.connectionSvc.send('get', `venta/detalle/vendedor?idNegocio=${this.dataIdentity.idNegocio}&fechaInicio=2023-12-12&fechaFin=2023-12-12&idSorteo=2`);

}


}
