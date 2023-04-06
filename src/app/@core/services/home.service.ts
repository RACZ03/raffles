import { Injectable } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private connectionSvc: ConnectionService
  ) { }

  getCountUsers(): Promise<any>{
    return this.connectionSvc.send('get', `util/inicio/q-usuarios`);
  }

  getGraficoVentas(days: number): Promise<any>{
    return this.connectionSvc.send('get', `util/inicio/grafico/${ days }`);
  }
}
