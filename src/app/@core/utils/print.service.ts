import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(
    private connectionSvc: ConnectionService,
  ) { }

  printTicket(ticket: any): Promise<any> {
    return this.connectionSvc.send('get', `venta/pdf/${ ticket }`);
  }
}
