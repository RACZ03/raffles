import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConnectionService } from './connection.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as moment from 'moment';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PrintService {

  public imageBackup: string = environment.imageUrl;
  constructor(private connectionSvc: ConnectionService, private http: HttpClient) {}

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

  async printTicket(ticket: any) {
    console.log(ticket);
    let {
          codigo,
          idVendedor,
          vendedor,
          ruta,
          idNegocio,
          sorteo,
          cantidadNumeros,
          montoTotal,
          fecha,
          hora,
          ventaDetalles,
          logoNegocio
        } = ticket;

    let imageLogo = '';
    // validate if logoNegocio is null get image from assets
    imageLogo = (logoNegocio != null || logoNegocio != undefined || logoNegocio != '') ? logoNegocio : await this.getImageAsBase64(this.imageBackup);
    // validate id logoNegocio contains http or https
    imageLogo = (imageLogo.includes('http') || imageLogo.includes('https')) ? imageLogo : await this.getImageAsBase64(this.imageBackup);

    // imageLogo = await this.convertImageToBase64(imageLogo);
    // convert image base64 no service

    // convertir nombre ruta a mayusculas
    ruta.nombre = ruta?.nombre.toUpperCase();
    // convertir nombre sorteo a mayusculas
    sorteo.nombre = sorteo?.nombre.toUpperCase();
    // convertir nombre vendedor a mayusculas
    vendedor = vendedor?.nombre.toUpperCase();
    // cambiar formato fecha a dd/mm/yyyy
    fecha = moment(fecha).format('DD/MM/YYYY');
    // cambiar formato hora a hh:mm a
    hora = moment(hora, 'HH:mm:ss').format('hh:mm a');

    const documentDefinition: TDocumentDefinitions = {
      pageSize: 'A6',
      pageOrientation: 'portrait',
      content: [
        {
          image: imageLogo,
          fit: [100, 100],
        },
        {
          text: `RECIBO ${ codigo }`,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          text: `RUTA: ${ ruta?.nombre }`,
          fontSize: 10,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          text: `${ fecha } - ${ hora } - ${ sorteo?.nombre }`,
          fontSize: 10,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              [{ text: 'NÚMERO', style: 'header' }, { text: 'MONTO', style: 'header' }, { text: 'PREMIO', style: 'header' }],
              ...ventaDetalles.map(({ numero, monto, premio }: any) => [numero, monto, premio]),
            ],
          },
          margin: [0, 15],
          alignment: 'center',
          layout: 'noBorders'
        },
        {
          text: `${ cantidadNumeros } NÚMEROS VENDIDOS`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          text: `TOTAL RECIBO :: ${ montoTotal } CÓRDOBAS`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          text: `${ vendedor }`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 1],
        },
        {
          text: 'Gracias por su compra. \nPor favor, conserve este recibo.\nNo se aceptan reclamos despues de 24 horas.',
          bold: true,
          fontSize: 8,
          alignment: 'center',
          margin: [0, 15],
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 11,
          color: 'black',
        },
        defaultStyle: {
          font: 'Helvetica',
        }
      }
    };

    // pdfMake.createPdf(documentDefinition).open();
    let pdf = pdfMake.createPdf(documentDefinition)
    pdf.print();
  }

  getImageAsBase64(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': 'content-type',
        'Access-Control-Request-Methods': 'POST'
      });
      this.http.get(url,
        {  observe: 'response',
            responseType: 'blob',
        }).subscribe((response: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          let base64data = reader.result;
          resolve(base64data as string);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

}
