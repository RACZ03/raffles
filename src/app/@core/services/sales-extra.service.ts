import { Injectable } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class SalesExtraService {

  constructor(
    private connectionSvc: ConnectionService,
  ) { }

  getCurrentRaffleExtra(): Promise<any> {
    return new Promise((resolve, reject) => {
      // get local storage if exist else get from server
      let currentRaffleExtra = localStorage.getItem('currentRaffleExtra');
      if (currentRaffleExtra) {
        resolve(JSON.parse(currentRaffleExtra));
      } else {
        this.currentRaffleExtra().then((res: any) => {
          if (res) {
            let { status, data } = res;
            if (status && status == 200) {
              localStorage.setItem('currentRaffleExtra', JSON.stringify(data));
              resolve(data);
            } else {
              reject(false);
            }
          } else {
            reject(false);
          }
        }).catch((err: any) => {
          reject(err);
        });
      }
    });
  }

  private currentRaffleExtra(): Promise<any> {
    return this.connectionSvc.send('get', `sorteo/obtener/extra`);
  }
}
