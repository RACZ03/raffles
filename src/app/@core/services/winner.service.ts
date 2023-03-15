import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ConnectionService } from '../utils/connection.service';

@Injectable({
  providedIn: 'root'
})
export class WinnerService {

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
  
  getwinners(): Promise<any> {
    return this.connectionSvc.send('get', `ganador/todos`);
  }
}
