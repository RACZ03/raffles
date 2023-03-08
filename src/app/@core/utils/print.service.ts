import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConnectionService } from './connection.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(private connectionSvc: ConnectionService) {}

  ticketData = {
    // logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB6q5FTeQY-de_wXL7jZB6p6hJYX_wG1AR3CxV0tjM17ymuuHCgj42C5FsdPIFNxDCVjs&usqp=CAU',
    number: '123456',
    date: '08/03/2023',
    shift: 'mañana',
    tableData: [
      { number: 1, amount: 100, prize: 200 },
      { number: 2, amount: 150, prize: 300 },
      { number: 3, amount: 200, prize: 400 },
    ],
    total: 450,
    seller: 'John Doe',
  };
  
  printTicket(ticket: any) {
    const documentDefinition: TDocumentDefinitions = {
      content: [
        // {
        //   image: this.ticketData.logo,
        //   fit: [100, 100],
        // },
        {
          text: `Ticket #${this.ticketData.number}`,
          fontSize: 20,
          margin: [0, 20],
        },
        {
          text: `${this.ticketData.date} - Turno: ${this.ticketData.shift}`,
          margin: [0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*'],
            body: [
              ['Nº', 'Monto', 'Premio', 'Total'],
              ...this.ticketData.tableData.map(({ number, amount, prize }) => [number, amount, prize, amount + prize]),
            ],
          },
          margin: [0, 20],
        },
        {
          text: `Monto Ganado: ${this.ticketData.total}`,
          margin: [0, 20],
        },
        {
          text: `Vendedor: ${this.ticketData.seller}`,
          margin: [0, 10],
        },
        {
          text: 'Gracias por su compra!',
          margin: [0, 20],
        },
      ],
    };

    pdfMake.createPdf(documentDefinition).open();
  }
}
