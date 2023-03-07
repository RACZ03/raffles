import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { DataNumbers } from 'src/app/@core/data/numbers';
import { SalesService } from 'src/app/@core/services/sales.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { SpinnerService } from 'src/app/@core/utils/spinner.service';
// import {  } from 'ngx-slick-carousel';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild('slickModal', { static: true }) slickModal!: SlickCarouselComponent;
  @ViewChild('InputAmount', { static: false }) inputAmount!: ElementRef;
  @ViewChild('InputNumber', { static: false }) inputNumber!: ElementRef;

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

  public formSale!: FormGroup;

  public listSales: any[] = [];
  public numberList: any[] = DataNumbers;
  public tablaEspecial: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertSvc: AlertService,
    private spinnerSvc: SpinnerService,
    private salesSvc: SalesService,
  ) {
    this.getCurrentRaflle();
  }

  ngOnInit(): void {
    this.formSale = this.initForm();
    if (window.innerWidth < 992) {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 2;
    }

  }

  async getCurrentRaflle() {
    let currentRaffle = await this.salesSvc.getCurrentRaffle();
    if (currentRaffle) {
      this.currentRaffle = currentRaffle;
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

  async onChange() {

    // get value number
    let number = this.formSale.get('number')?.value;

    // validate if number is empty
    if (!number) {
      return;
    }
    // spinner
    this.spinnerSvc.show();

    // get limit
    await this.getLimit(number);
    await this.getSales(number);
    // hide spinner
    setTimeout(() => {
      this.spinnerSvc.hide();
    }, 500);
    // change focus to amount
    this.inputAmount.nativeElement.focus();
  }

  getLimit(number: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let respLimit = await this.salesSvc.getLimit(number, this.currentRaffle.id);
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
      let respSales = await this.salesSvc.getSales(number, this.currentRaffle.id);
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

    let amount = this.formSale.get('amount')?.value;
    // validate amount is more than 0
    if (amount <= 0) {
      this.alertSvc.showAlert(3, '', 'El monto ingresado debe ser mayor a 0');
      return;
    }

    let resp = await this.salesSvc.getAward(amount);
    if (resp) {
      let { status, data } = resp;
      if (status && status == 200) {
        // sum amount sold + data
        let amount_sold = this.amount_sold + data;
        // validate if amount sold is minor than limit
        if (amount_sold > this.limit) {
          // show alert
          this.alertSvc.showAlert(2, 'Advertencia', 'El monto ingresado supera el limite permitido');
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
          this.slickModal.slickNext();
        }
      }
    }
  }

  async onSend() {


  }

  ngAfterViewInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 992) {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 2;
    }
    this.slickModal.unslick();
    this.slickModal.initSlick();
  }
}