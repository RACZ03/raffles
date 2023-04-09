import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { LimitService } from 'src/app/@core/services/limit.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-freenumbertobisness',
  templateUrl: './freenumbertobisness.component.html',
  styleUrls: ['./freenumbertobisness.component.scss']
})
export class FreenumbertobisnessComponent implements OnInit {


  @Output() onClose = new EventEmitter<boolean>();

  formfreeNumberToBusiness!: FormGroup;
  itemsAsObjects : any[] = [];
  BusinessData: any[] = [];
  items: any[]= [];
  inputText = 'text';

    ///constructor
  constructor(
    private fb: FormBuilder,
    private limitSvc: LimitService,
    private alertSvc: AlertService,
    private businessSvc: BusinessService,
    private el: ElementRef)
     {
    }

    public insertInputTag(): void {
      if (this.inputText) {
          this.items.push(this.inputText);
          this.inputText = '';
      }
  }

    //whitdefault
    displayTags(event : any) {
      console.log(event);
      this.itemsAsObjects = event;
    }


 //OnInit
   ngOnInit(): void {
    this.formfreeNumberToBusiness = this.initForms();
    let Roles = JSON.parse(localStorage.getItem('roles') || '{}');
    for (const item of Roles) {
      if(item.nombre == 'ROLE_SUPER_ADMIN'){
        this.loadDataBusiness();
      }

    }


  }

 async loadDataBusiness() {

     let resp = await this.businessSvc.getBusiness();
     if(resp == undefined)
     return;
    this.BusinessData = resp?.data;
  }

 async onSubmit(){
    if(this.formfreeNumberToBusiness.invalid){
      return;
    }
    let listbusinessSelected = this.formfreeNumberToBusiness.value.negocios;
    let listNumeros = this.formfreeNumberToBusiness.value.numeros;

    let numeros: any[] = [];
    let business: any[] = [];
    if(listbusinessSelected!==null){
      for (const item of listbusinessSelected) {
        business.push(item);
      }
    }

    if(listNumeros!==null){
      for (const item of listNumeros) {
        numeros.push(item.value);
      }
    }

    let obj ={
      vendedoresOrRutaOrNegocio: business,
      numeros: numeros,
    }

    let Confirmar = this.alertSvc.showConfirmLimit('Liberar Numeros', '¿Está seguro de liberar los números seleccionados?', 'Confirmar');
    if(await Confirmar){
      let resp = await this.limitSvc.freeNumberToBusiness(obj);
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
      this.formfreeNumberToBusiness.reset();
      this.closeModal(true);
    }else{
      this.alertSvc.showAlert(4, message,'error');
    }
    }
  else{
    this.alertSvc.showAlert(2, 'Liberacion de numeros','ELa liberacion de numeros fue cancelado por el usuario');
      this.loadDataform();
      this.onClose.emit(true);
  }


  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formfreeNumberToBusiness.get(name)?.touched && this.formfreeNumberToBusiness.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      negocios: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formfreeNumberToBusiness.reset();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.key;
    const inputValue = this.el.nativeElement.value;
    // Solo permitir dígitos numéricos, retroceso, borrar y flechas
    if (event.key === '8' || event.key === '46' || event.key === '37' || event.key === '39' ||
    event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
    ||/^\d+$/.test(input)) {
      // Permitir que el evento se propague y actualizar el valor del control
      setTimeout(() => {
        let numeros: any[] = this.formfreeNumberToBusiness?.get('numeros')?.value;

        if ( inputValue === '' || inputValue === null || inputValue == undefined ) {
          return;
        }
        numeros.push({
          display: inputValue,
          value: inputValue
        });
        this.formfreeNumberToBusiness?.get('numeros')?.setValue(numeros);
      });
    } else {
      // Cancelar el evento
      event.preventDefault();
    }
  }

}
