import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraordinarySalesService {

  constructor(
    private connectionSvc: ConnectionService,
  ) { }

  getIdentity(): any {
    let identity = localStorage.getItem('identity');
    if (identity) {
      return JSON.parse(identity);
    } else {
      return null;
    }
  }

  getBusiness(): any {
    let business = localStorage.getItem('business');
    if (business) {
      return JSON.parse(business);
    } else {
      return null;
    }
  }

  getCurrentRaffle(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.currentRaffle().then((res: any) => {
          if (res) {
            localStorage.setItem('currentRaffleExtra', JSON.stringify((res != null) ? res : true));
            resolve(res != null ? res : true );
          } else {
            localStorage.setItem('currentRaffleExtra', JSON.stringify(false));
            resolve(false);
          }
        }).catch((err: any) => {
          reject(err);
        });
      // }
    });
  }

  private currentRaffle(): Promise<any> {
    return this.connectionSvc.send('get', `sorteo/obtener/extra`);
  }

  getLimit(number: number, lottery: number) {
    let id: any = this.getIdentity().id;
    return this.connectionSvc.send('get', `util/limite/vendedor/${ id }/numero/${ number }/sorteo/${ lottery }`);
  }

  getSales(number: number, lottery: number) {
    let id: any = this.getIdentity().id;
    let dateNow = moment().format('YYYY-MM-DD');

    return this.connectionSvc.send('get', `util/venta/vendedor/${ id }/numero/${ number }/fecha/${ dateNow }/sorteo/${ lottery }`);
  }

  getAward(amount: number) {
    let tablaEspecial = (this.getIdentity().tablaEspecial != undefined || this.getIdentity().tablaEspecial != null) ? this.getIdentity().tablaEspecial : false;
    let businessId = this.getBusiness().idNegocio;
    return this.connectionSvc.send('get', `catalogo-premio/obtener-premio/negocio/${ businessId }/monto/${ amount }?especial=${ tablaEspecial }`);
  }

  save(data: any, idSorteo: number): Promise<any> {

    let objArray = [];
    for (const item of data) {
      objArray.push({
        numero: item.number,
        monto: item.amount,
        premio: item.prize,
      });
    }
    let params = JSON.stringify(objArray);
    return this.connectionSvc.send('post', `venta/guardar/extra?idSorteo=${ idSorteo }`, params);
  }

  getSaleByCode(code: string): Promise<any> {
    return this.connectionSvc.send('get', `venta/obtener/${ code }`);
  }

}
