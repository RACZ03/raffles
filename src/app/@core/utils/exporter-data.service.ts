import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { formatDate } from '@angular/common';

declare var window: any;

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExporterDataService {

  public imageBackup: string = environment.imageUrl;

  constructor(
    private storage: AngularFireStorage
  ) {
    // console.log('ExporterDataService');
  }

  getBusinessByAuth(): any {
    return JSON.parse(localStorage.getItem('business') || '') || [];
  }

  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // get current date, format date and time
    let dateString = this.currentDateTime;
    FileSaver.saveAs(data, fileName + '_export_' + dateString + EXCEL_EXTENSION);
  }

  async exportPdf(json: any[], pdfFileName: string,  countCol: number = 0,  orientation: boolean = false) {
    let business = this.getBusinessByAuth();
    let logo = business?.logo;

    let imageLogo = '';
    // validate if logoNegocio is null get image from assets
    imageLogo = (logo !== null ) ? ( (logo !== '' ) ? logo : this.imageBackup ): this.imageBackup;
    // validate id logoNegocio contains http or https
    imageLogo = (imageLogo.includes('http') || imageLogo.includes('https')) ? imageLogo : this.imageBackup;
    let img = await this.getImageAsBase64(imageLogo);

    // create header from table dinamic
    let headerRows = [];
    let columnWidths = [];
    for (let i = 0; i < countCol; i++) {
      // get key from json
      let key = Object.keys(json[0])[i];
      headerRows.push({ text: key, style: 'header' });
      columnWidths.push('*');
    }

    // create body from table dinamic
    let bodyRows = [];
    for (const element of json) {
      let row = [];
      for (let j = 0; j < countCol; j++) {
        // get value from json
        let value = Object.values(element)[j];
        row.push(
          { text: value,
            style: 'defaultStyle',
            border: [
              { width: 0.5, color: '#172b4d' },
              { width: 0.5, color: '#172b4d' },
              { width: 0.5, color: '#172b4d' },
              { width: 0.5, color: '#172b4d' },
            ]
          }
        );
      }
      bodyRows.push(row);
    }

    const table = {
      headerRows: 1,
      widths: columnWidths,
      body: [headerRows, ...bodyRows],
      // border: [true, true, true, true],
      style: {
        fontSize: 10,
      }
    };

    let businessName = ( business !== null || business !== undefined ) ? business?.negocio.toUpperCase() : 'Lucky pro';

    let description = 'Registro de ' + pdfFileName
    const documentDefinition: TDocumentDefinitions = {
      pageSize: !orientation ? 'A4' : 'A3',
      pageOrientation: !orientation ? 'portrait' : 'landscape',
      content: [
        {
          image: img,
          fit: [60, 60],
          alignment: 'center',
        },
        {
          text: businessName,
          alignment: 'center',
          fontSize: 14,
          bold: true,
        },
        {
          text: description.toUpperCase(),
          alignment: 'center',
          fontSize: 10,
          bold: true,
        },
        {
          table: table,
          margin: [0, 10],
        },
        {
          text: 'Total de registros: ' + json.length,
          alignment: 'right',
          margin: [0, 10, 20, 0],
          fontSize: 10,
        }
      ],
      footer: function(currentPage, pageCount) {
        return {
          columns: [
            { text: formatDate(new Date(), 'dd-MM-yyyy hh:mm a', 'en-US', 'America/Managua'), alignment: 'left', margin: [20, 0], fontSize: 9 },
            { text: currentPage.toString() + ' de ' + pageCount, alignment: 'right', margin: [0, 0, 20, 0], fontSize: 9 }
          ]
        };
      },
      styles: {
        header: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#f5365c', // color de fondo
        },
        defaultStyle: {
          fontSize: 10,
        }
      }
    };

    // addd name to pdf
    pdfFileName = pdfFileName + '_' + this.currentDateTime + '.pdf';
    pdfMake.createPdf(documentDefinition).download(pdfFileName);
  }


  get currentDateTime(): string {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return day + '/' + month + '/' + year + '_' + hour + ':' + minute + ':' + second;
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
