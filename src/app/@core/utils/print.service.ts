import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConnectionService } from './connection.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';


declare var window: any;
declare const navigator: any;

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PrintService {

  public imageBackup: string = environment.imageUrl;
  public imageUrl$!: Observable<string>;

  public device!: any;
  public codigoTicket: string = '';

  constructor(
    private connectionSvc: ConnectionService,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {
    console.log('PrintService');
  }

  async printTicket(ticket: any): Promise<any> {

    return new Promise(async (resolve, reject) => {
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
      imageLogo = (logoNegocio != null || logoNegocio != undefined || logoNegocio != '') ? logoNegocio : this.imageBackup;
      // validate id logoNegocio contains http or https
      imageLogo = (imageLogo.includes('http') || imageLogo.includes('https')) ? imageLogo : this.imageBackup;
      let img = await this.getImageAsBase64(imageLogo);

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
            image: img,
            fit: [100, 100],
            alignment: 'center',
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

      if ( this.isPrintingSupported()) {
        pdf.print({
          autoPrint: true,
        });
      } else {
        pdf.open();
      }
      resolve(false);

    });
  }

  async getImageAsBase64(filePath: string): Promise<string> {
    const ref = this.storage.refFromURL(filePath);

    const url = await ref.getDownloadURL().toPromise();
    const response = await fetch(url);
    const blob = await response.blob();
    return await this.blobToBase64(blob);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public isPrintingSupported(): boolean {
    return !!window.printer;
  }

}
