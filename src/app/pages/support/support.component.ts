import { Component, OnInit } from '@angular/core';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AlertService } from 'src/app/@core/utils/alert.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import * as printJS from 'print-js';
import * as moment from 'moment';



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
      { text: 'RECIBO 022020', fontSize: 18 },
      { text: 'Contenido del recibo', fontSize: 12 },
    ]
  };


  constructor(
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    console.log('SupportComponent');
  }

  private device!: BluetoothDevice;

  // Función para convertir una URL de datos a un objeto Uint8Array
  dataURLtoUint8Array(dataUrl: string) {
    const base64 = dataUrl.substr(dataUrl.indexOf(',') + 1);
    const raw = atob(base64);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  splitBytes(bytes: any) {
    const chunkSize = 512;
    const chunks = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
      chunks.push(bytes.slice(i, i + chunkSize));
    }
    return chunks;
  }

  findPrinter(band = false) {

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
      // service.getCharacteristic('000018f0-0000-1000-8000-00805f9b34fb').then((characteristic: any) => {
      //   //let data = new Uint8Array([0x41, 0x42, 0x43]); // Datos de impresión
      //   // create document pdf
      //   this.pdf.getBase64((data: any) => {
      //     characteristic.writeValue(data);
      //   });
      // });
      service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb').then( async (characteristic: any) => {
        let array: string[] = [
          '               RECIBO',
          '           RUTA: ISRAEL',
          '      ' + moment().format('DD/MM/YYYY') + ' - ' + moment().format('HH:mm:ss'),
          '',
          '        NUMERO      MONTO',
          '        22           2000',
          '',
          '        TOTAL:       2000',
          '           JUAN PEREZ',
          '',
          ' GRACIAS POR SU COMPRA',
        ];

        for (let i = 0; i < array.length; i++) {
          const element = array[i] + '\n'; // Agregar un salto de línea al final
          const encoder = new TextEncoder();
          const data = encoder.encode(element);
          characteristic.writeValue(data);
        }


        // print lorem ipsum
        // let data = new Uint8Array([0x41, 0x42, 0x43, 0x31]); // Datos de impresión
        // // let data = new Uint8Array([0x41, 0x42, 0x43]); // Datos de impresión
        // characteristic.writeValue(data);
        // let text = 'RECIPT 022020';
        // // CONVERTIR TEXT A BYTES
        // const encoder = new TextEncoder();
        // const data = encoder.encode(text);

        // characteristic.writeValue(data);
        // await pdfMake.createPdf(this.documentDefinition).getBuffer( (buffer: any) => {
        //   // const uint8Array = new Uint8Array(buffer);
        //   // characteristic.writeValue(buffer);
        //   const chunks = this.splitBytes(buffer);
        //       let index = 0;

        //       function sendChunk() {
        //         if (index < chunks.length) {
        //           const chunk = chunks[index];
        //           characteristic.writeValue(chunk).then(() => {
        //             index++;
        //             setTimeout(sendChunk, 100); // Esperar 100 ms entre envíos
        //           }).catch((error: any) => {
        //             console.error(error);
        //           });
        //         }
        //       }

        //       sendChunk();
        // });
        // await pdfMake.createPdf(this.documentDefinition).getBuffer( (buffer: ArrayBuffer) => {

        // });


        // Obtener los datos como Uint8Array

        // pdfDocGenerator.getBuffer((buffer: ArrayBuffer) => {
        //   // const uint8Array = new Uint8Array(buffer);

        //   let index = 0;
        //   const chunks = this.splitBytes(buffer);
        //   function sendChunk() {
        //     if (index < chunks.length) {
        //       const chunk = chunks[index];
        //       characteristic.writeValue(chunk).then(() => {
        //         index++;
        //         setTimeout(sendChunk, 100); // Esperar 100 ms entre envíos
        //       }).catch((error: any) => {
        //         console.error(error);
        //       });
        //     }
        //   }
        //   sendChunk();
        // });
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
    // if (localStorage.getItem('devicePrint') === null) {
    //   this.findPrinter();
    //   return;
    // } else {
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
          characteristic => characteristic.writeValue(new Uint8Array([0x41, 0x42, 0x43]))
          // characteristic => characteristic.writeValue(pdf.print({autoPrint: true}) as any)
          // characteristic => characteristic.writeValue(new Uint8Array(pdfArray as any))
        )
        .then(() =>
          // console.log('Printed successfully');
          this.alertSvc.showAlert(1, 'Printed successfully', 'Please check the printer')
        )
        .catch(error => {
          console.error('Error printing:', error);
          this.alertSvc.showAlert(4, 'Error printing', error);
        });
    // }

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
