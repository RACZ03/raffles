import { Component, OnInit } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AlertService } from 'src/app/@core/utils/alert.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import * as printJS from 'print-js';



(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

declare const navigator: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  public documentDefinition: TDocumentDefinitions = {
    pageSize: 'A6',
    pageOrientation: 'portrait',
    content: [
      {
        text: `RECIBO ${ 12312312 }`,
        bold: true,
        fontSize: 12,
        alignment: 'center',
        margin: [0, 1],
      },
      {
        text: `FECHA ${ new Date().toLocaleDateString() }`,
        bold: true,
        fontSize: 12,
        alignment: 'center',
        margin: [0, 1],
      },
    ],
  };
  public pdf: any = pdfMake.createPdf(this.documentDefinition);

  constructor(
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    console.log('SupportComponent');
  }

  private device!: BluetoothDevice;

  findPrinter(band = false) {
    // verify if navigator.bluetooth exists
    // if ( !navigator.bluetooth) {
    //   // this.alertSvc.showAlert(4, 'Error', 'Web Bluetooth API is not available in this browser.');


    //   // create pdf and send to print pdf
    //   const documentDefinition: TDocumentDefinitions = {
    //     pageSize: 'A6',
    //     pageOrientation: 'portrait',
    //     content: [
    //       {
    //         text: `RECIBO ${ 12312312 }`,
    //         bold: true,
    //         fontSize: 12,
    //         alignment: 'center',
    //         margin: [0, 1],
    //       },
    //       {
    //         text: `FECHA ${ new Date().toLocaleDateString() }`,
    //         bold: true,
    //         fontSize: 12,
    //         alignment: 'center',
    //         margin: [0, 1],
    //       },
    //     ],
    //   };
    //   let pdf = pdfMake.createPdf(documentDefinition);

    //   // open modal to print pdf
    //   pdf.getBase64((data) => {
    //     printJS({
    //       printable: data,
    //       type: 'pdf',
    //       base64: true,
    //       showModal: true,
    //       modalMessage: 'Imprimiendo...',

    //     });
    //   });

    //   return;

    // }

    navigator.bluetooth.requestDevice({
      filters: [{
        // services: ['public-a001']
        services: ['000018f0-0000-1000-8000-00805f9b34fb']
      }]
    })
    .then((device: any) => {
      console.log('Impresora encontrada:', device);
      this.alertSvc.showAlert(1, 'Impresora encontrada', device.name);
      this.device = device;
      // set device in localstorage
      localStorage.setItem('devicePrint', JSON.stringify(device));
      return device.gatt.connect();
    })
    .then((server: any) => {
      this.alertSvc.showAlert(1, 'Conectado', 'Conectado a la impresora');
      // return server.getPrimaryService('public-a001');
      return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    })
    .then((service: any) => {
      // Aquí puedes utilizar los métodos y características del servicio para enviar datos de impresión a la impresora.
      // Por ejemplo:
      // service.getCharacteristic('public-a002').then((characteristic) => {
      //   let data = new Uint8Array([0x41, 0x42, 0x43]); // Datos de impresión
      //   characteristic.writeValue(data);
      // });
      //  create document pdf
      this.pdf.getBase64((data: any) => {
          printJS({
            printable: data,
            type: 'pdf',
            base64: true,
            showModal: true,
            modalMessage: 'Imprimiendo...',
          });
      });
    })
    .catch((error: any) => {
      console.error(error);
      this.alertSvc.showAlert(4, 'Error', error);
    });
  }

  async print() {
    console.log('Printing...', this.device)
    // find device in localstorage
    // verify exists devicePrint int localstorage
    if (localStorage.getItem('devicePrint') === null) {
      this.findPrinter();
      return;
    } else {
      const device = JSON.parse(localStorage.getItem('devicePrint') || '');
      console.log('device', device);
      if ( device ! === '' ) {
        this.device = device;
      } else {
        this.findPrinter(true);
      }

      if (!this.device || !this.device.gatt) {
        // console.error('Device not connected');
        this.alertSvc.showAlert(3, 'Device not connected', 'Please connect to the printer first');
        return;
      }
      // crear mensaje a imprimir
      // crear un pdf con el mensaje
      const documentDefinition: TDocumentDefinitions = {
        pageSize: 'A6',
        pageOrientation: 'portrait',
        content: [
          {
            text: `RECIBO ${ 12312312 }`,
            bold: true,
            fontSize: 12,
            alignment: 'center',
            margin: [0, 1],
          },
          {
            text: `FECHA ${ new Date().toLocaleDateString() }`,
            bold: true,
            fontSize: 12,
            alignment: 'center',
            margin: [0, 1],
          },
        ],
      };
      let pdf = pdfMake.createPdf(documentDefinition);
      // const pdfArray = await pdf.getBuffer();
      const pdfArray = await pdf.getBase64( (data) => { console.log('data', data); } );

      this.device.gatt.connect()
        .then((server: any) => server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb'))
        .then(service => service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb'))
        .then(
          // characteristic => characteristic.writeValue(pdf.print({autoPrint: true}) as any)
          characteristic => characteristic.writeValue(new Uint8Array(pdfArray as any))
        )
        .then(() =>
          // console.log('Printed successfully');
          this.alertSvc.showAlert(1, 'Printed successfully', 'Please check the printer')
        )
        .catch(error => {
          console.error('Error printing:', error);
          this.alertSvc.showAlert(4, 'Error printing', error);
        });
    }

  }


  async printPDF() {
    // Define el contenido del PDF utilizando pdfmake
    const docDefinition = {
      content: [
        'Este es un PDF generado con pdfmake!'
      ]
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob: Blob) => {
      // Convierte el Blob en una URL de datos
      const url = URL.createObjectURL(blob);

      // Imprime el documento PDF utilizando la función "printJS"
      printJS({
        printable: url,
        type: 'pdf'
      });

      // Libera la URL de datos del Blob
      URL.revokeObjectURL(url);
    });
  }

}
