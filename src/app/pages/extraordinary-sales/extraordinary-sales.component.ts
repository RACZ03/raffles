import { UsersService } from 'src/app/@core/services/users.service';
import { ExtraordinarySalesService } from './../../@core/services/extraordinary-sales.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { DataNumbers } from 'src/app/@core/data/numbers';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { SpinnerService } from 'src/app/@core/utils/spinner.service';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PrintService } from 'src/app/@core/utils/print.service';
import * as moment from 'moment';

declare const navigator: any;

@Component({
  selector: 'app-extraordinary-sales',
  templateUrl: './extraordinary-sales.component.html',
  styleUrls: ['./extraordinary-sales.component.scss']
})
export class ExtraordinarySalesComponent implements OnInit {

  @ViewChild('slickModalExtra', { static: false }) slickModal!: SlickCarouselComponent;
  @ViewChild('InputAmountExtra', { static: false }) inputAmount!: ElementRef;
  @ViewChild('InputNumberExtra', { static: false }) inputNumber!: ElementRef;

  public slideConfig: any = {
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1
  };

  public currentRaffle: any = null;
  public limit: number = 0;
  public amount_sold: number = 0;
  public isInputFocused: boolean = false;

  public formSale!: FormGroup;

  public identity: any = null;
  public listSales: any[] = [];
  public numberList: any[] = DataNumbers;
  public tablaEspecial: boolean = false;
  public disabledActions: boolean = false;
  public business: any = null;

  constructor(
    private fb: FormBuilder,
    private alertSvc: AlertService,
    private spinnerSvc: SpinnerService,
    private extraordinarySalesSvc: ExtraordinarySalesService,
    private authSvc: AuthService,
    private printSvc: PrintService,
    private userSvc: UsersService
  ) {
    // get business from localstorage
    this.business = JSON.parse(localStorage.getItem('business') || '{}');
  }

  async ngOnInit() {
    this.formSale = this.initForm();
    this.getCurrentRaflle();

    if (window.innerWidth < 992) {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 2;
    }
    let user = await this.authSvc.getIdentity();
    this.identity = JSON.parse(user);

  }

  async getCurrentRaflle() {

    // VALIDATE IF HOUR IS NOT PASSET TO 6:00 PM
    let hour = moment().format('HH:mm');
    let hourLimit = moment('18:00', 'HH:mm').format('HH:mm');
    if (hour > hourLimit) {
      this.alertSvc.showAlert(3,'', 'No hay sorteo activo');
      // disabled form
      this.disabledActions = true;
      // get div by class carousel
      let carousel = document.getElementById('div-carousel-extra');
      // add clase hide
        carousel?.classList.add('d-none');
      return;
    }

    let currentRaffle = await this.extraordinarySalesSvc.getCurrentRaffle();
    // console.log(currentRaffle);
    if (currentRaffle && currentRaffle?.status == 200 ) {
      this.disabledActions = false;
      this.currentRaffle = currentRaffle?.data;
    } else {
      this.alertSvc.showAlert(3,'', 'No hay sorteo activo');
      // disabled form
      this.disabledActions = true;
      // get div by class carousel
      let carousel = document.getElementById('div-carousel-extra');
      // add clase hide
        carousel?.classList.add('d-none');
    }
  }

  validateInput(input: string): boolean {
    return this.formSale.get(input)?.invalid && this.formSale.get(input)?.touched ? true : false;
  }

  initForm(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      prize: ['', []],
    });
  }

  async onChangeFocus(e: any) {

    let value: any = e?.target?.value;

    if (value.length == 2) {
      this.inputAmount.nativeElement.focus();
    }
    this.isInputFocused = true;
  }

  async onChange() {

    this.isInputFocused = true;
    this.limit = 0;
    this.amount_sold = 0;
    // get value number
    let number = this.formSale.get('number')?.value;

    // validate if number is minor than 0 and major than 99
    if (number < -1 || number > 99) {
      this.alertSvc.showAlert(3, '', 'Número no valido');
      this.formSale.get('number')?.setValue('');
      this.inputNumber.nativeElement.focus();
      return;
    }

    // validate if number is not exists in list
    if (this.listSales.find((item: any) => item.number == number)) {
      this.alertSvc.showAlert(3, '', 'El número ya se encuentra en la lista');
      this.formSale.get('number')?.setValue('');
      this.inputNumber.nativeElement.focus();
      return;
    }

    // validate if number is empty
    if (number == null && number == undefined) {
      return;
    }


    // get limit
    await this.getLimit(number);
    await this.getSales(number);
    // change focus to amount
    this.inputAmount.nativeElement.focus();
  }

  getLimit(number: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let respLimit = await this.extraordinarySalesSvc.getLimit(number, this.currentRaffle?.id);
      if (respLimit) {
        let { status, data } = respLimit;
        if (status && status == 200) {
          this.limit = (data == null) ? 0 : data;
          resolve(true);
        } else {
          this.limit = 0;
          resolve(true);
        }
      }
    });
  }

  getSales(number: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let respSales = await this.extraordinarySalesSvc.getSales(number, this.currentRaffle.id);
      if (respSales) {
        let { status, data } = respSales;
        if (status && status == 200) {
          this.amount_sold = data;
          resolve(true);
        } else {
          this.amount_sold = (data == null) ? 0 : data;
          resolve(true);
        }
      }
    });
  }

  async onSave() {

    // validate form
    if (this.formSale.invalid) {
      return;
    }

    this.isInputFocused = false;
    let amount = this.formSale.get('amount')?.value;
    // validate amount is more than 0
    if (amount <= 0) {
      this.alertSvc.showAlert(3, '', 'El monto ingresado debe ser mayor a 0');
      return;
    }

    let resp = await this.extraordinarySalesSvc.getAward(amount);
    if (resp) {
      let { status, data, comment } = resp;
      if (status && status == 200) {
        // sum amount sold + data
        let amount_sold = this.amount_sold + data;
        // validate if amount sold is minor than limit
        if (amount_sold > this.limit) {
          // show alert
          this.alertSvc.showAlert(2, 'Advertencia', 'El monto ingresado supera el limite permitido');
          // change focus to number
          this.inputNumber.nativeElement.focus();
        } else {
          // set prize
          this.formSale.get('prize')?.setValue(data);
          // push to list
          this.listSales.push(this.formSale.value);
          // reset form
          this.formSale.reset();
          // change focus to number
          this.inputNumber.nativeElement.focus();
          // change carousel
          this.limit = 0;
          this.amount_sold = 0;
          // this.slickModal?.slickNext();
        }
      } else {
        this.alertSvc.showAlert(3, '', comment);
        // clear amount
        this.formSale.get('amount')?.setValue('');
        // change focus to amount
        this.inputAmount.nativeElement.focus();
      }
    } else {
      this.alertSvc.showAlert(3, '', 'Error al obtener premio');
      // change focus to amount
      this.inputAmount.nativeElement.focus();
    }
  }

  onRemove(item: any,i: number) {
    // show alert confirm
    this.alertSvc.showConfirmLimit('', `¿Está seguro de eliminar el número ${ item.number }?`, 'Eliminar').then((resp) => {
      if (resp) {
        this.listSales.splice(i, 1);
      }
    });
  }

  async onSaveAll() {
    // change focus to number
    this.inputNumber.nativeElement.focus();
    // validate if listSales is empty
    if (this.listSales.length == 0) {
      this.alertSvc.showAlert(3, '', 'No hay ventas para registrar');
      return;
    }

    // send data
    let resp = await this.extraordinarySalesSvc.save(this.listSales, this.currentRaffle.id);
    if (resp) {
      let { status, comment, data: dataTiket } = resp;
      if (status && status == 200) {
        this.alertSvc.showAlert(1, '', comment);
        this.listSales = [];

        let respTicket = await this.userSvc.verifyPrint();
        if (respTicket) {
          let { status, data } = respTicket;
          if (status && status == 200) {
            if ( data ) {
              await this.getTickets(dataTiket);
            }
          }
        }
        // move to first carousel
        this.slickModal?.slickGoTo(0);
        // change focus to number
        this.inputNumber.nativeElement.focus();

        this.getCurrentRaflle();
      } else {
        this.alertSvc.showAlert(3, '', comment);
      }
    }
  }

  async getTickets(code: string) {

    if ( navigator.bluetooth ) {
      try {
        if ( this.printSvc.device ) {
          this.printSvc.device.gatt.connect().then((server: any) => {
            return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
          })
          .then((service: any) => {
            service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb').then( async (characteristic: any) => {

              let resp = await this.extraordinarySalesSvc.getSaleByCode(code);
              let { status, data } = resp;
              if (status && status == 200) {
                let { status, data } = resp;
                let {
                  codigo,
                  vendedor,
                  ruta,
                  sorteo,
                  cantidadNumeros,
                  montoTotal,
                  fecha,
                  hora,
                  ventaDetalles,

                } = data;
                // convertir nombre de negocio a mayusculas
                let negocio = vendedor?.negocioAndRuta?.negocio.toUpperCase();
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

                let arrayPrint: string[] = [
                  'RECIBO ' + codigo,
                  'NEGOCIO: ' + negocio,
                  'RUTA: ' + ruta?.nombre,
                  fecha + ' - ' + hora + ' - ' + sorteo?.nombre,
                  '',
                  '    NUMERO' + '  ' + 'MONTO' + '  ' + 'PREMIO',
                ];
                // ADD NUMBERS TO PRINT
                ventaDetalles.forEach((element: any) => {
                  arrayPrint.push('      ' + ( (element.numero <= 9)  ? element.numero + ' ' : element.numero ) + '      ' + ((element.monto <= 9 ) ? (element.monto + '      ') : ((element.monto <= 99) ? (element.monto + '     ') : (element.monto + '   ') )) + element.premio);
                });
                arrayPrint.push('');
                // ADD TOTAL TO PRINT
                arrayPrint.push(cantidadNumeros + ' NUMEROS VENDIDOS');
                arrayPrint.push('TOTAL RECIBO :: ' + montoTotal + ' CORDOBAS');
                arrayPrint.push(vendedor);
                arrayPrint.push('');
                arrayPrint.push('Gracias por su compra. \nPor favor, conserve este recibo.\nNo se aceptan reclamos despues de 24 horas.\n\n');

                for (const iterator of arrayPrint) {
                  const element = iterator + '\n'; // Agregar un salto de línea al final
                  const encoder = new TextEncoder();
                  const data = encoder.encode(element);
                  await characteristic.writeValue(data);
                }
              }
            });
          }).catch((error: any) => {
            console.log('INFO:', error);
            this.printSvc.device = null;
            this.getTickets(code);
          });
        } else {
          navigator.bluetooth.requestDevice({
            filters: [{
              services: ['000018f0-0000-1000-8000-00805f9b34fb']
            }]
          })
          .then((device: any) => {
            console.log('Impresora encontrada:', device);
            // set device in localstorage
            this.printSvc.device = device;
            return device.gatt.connect();
          })
          .then((server: any) => {
            return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
          })
          .then((service: any) => {
            service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb').then( async (characteristic: any) => {

              let resp = await this.extraordinarySalesSvc.getSaleByCode(code);
              let { status, data } = resp;
              let {
                codigo,
                vendedor,
                ruta,
                sorteo,
                cantidadNumeros,
                montoTotal,
                fecha,
                hora,
                ventaDetalles,
              } = data;

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

              let arrayPrint: string[] = [
                '        RECIBO ' + codigo,
                '   RUTA: ' + ruta?.nombre,
                '' + fecha + ' - ' + hora + ' - ' + sorteo?.nombre,
                '',
                '    NUMERO' + '  ' + 'MONTO' + '  ' + 'PREMIO',
              ];
              // ADD NUMBERS TO PRINT
              ventaDetalles.forEach((element: any) => {
                arrayPrint.push('      ' + ( (element.numero <= 9)  ? element.numero + ' ' : element.numero ) + '      ' + ((element.monto <= 9 ) ? (element.monto + '      ') : ((element.monto <= 99) ? (element.monto + '     ') : (element.monto + '   ') )) + element.premio);
              });
              arrayPrint.push('');
              // ADD TOTAL TO PRINT
              arrayPrint.push('    ' + cantidadNumeros + ' NUMEROS VENDIDOS');
              arrayPrint.push('  TOTAL RECIBO :: ' + montoTotal + ' CORDOBAS');
              arrayPrint.push('    ' + vendedor);
              arrayPrint.push('');
              arrayPrint.push('Gracias por su compra. \nPor favor, conserve este recibo.\nNo se aceptan reclamos despues de 24 horas.\n\n');

              for (const iterator of arrayPrint) {
                const element = iterator + '\n'; // Agregar un salto de línea al final
                const encoder = new TextEncoder();
                const data = encoder.encode(element);
                await characteristic.writeValue(data);
              }
            });
          })
          .catch((error: any) => {
            // console.log('INFO:', error);
            this.printSvc.device = null;
            // this.getTickets(code);
          });
        }
      } catch (error) {
        this.printSvc.device = null;
        // console.log('tri catch error', error);
        // this.getTickets(code);
      }
    } else {

      let resp = await this.extraordinarySalesSvc.getSaleByCode(code);
      if (resp) {
        let { status, data } = resp;
        if (status && status == 200) {
          await this.printSvc.printTicket(data);
        }
      }
    }
  }


  connectBluetooth() {
    if ( navigator.bluetooth ) {
      if (this.printSvc.device) {
        this.printSvc.device = null;
      } else {
        // verificar permisos de bluetooth
        navigator.bluetooth.requestDevice({
          filters: [{
            services: ['000018f0-0000-1000-8000-00805f9b34fb']
          }]
        })
        .then((device: any) => {
          // console.log('Impresora encontrada:', device);
          // set device in localstorage
          this.printSvc.device = device;
          return device.gatt.connect();
        })
        .then((server: any) => {
          this.alertSvc.showAlert(1, 'Success', 'Impresora conectada');
          return server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        })
        .catch((error: any) => {

          this.printSvc.device = null;
          this.alertSvc.showAlert(3, 'Info', 'No se pudo conectar con la impresora');
        });
      }
    } else {
      this.alertSvc.showAlert(3, 'Info', 'Su navegador no soporta esta funcionalidad');
    }
  }

  ngAfterViewInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    if ( !this.isInputFocused ) {
      if (event.target.innerWidth < 992) {
        this.slideConfig.slidesToShow = 1;
      } else {
        this.slideConfig.slidesToShow = 2;
      }
      this.slickModal?.unslick();
      this.slickModal?.initSlick();
    }
  }
}
