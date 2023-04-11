import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-changeonelimits',
  templateUrl: './changeonelimits.component.html',
  styleUrls: ['./changeonelimits.component.scss']
})
export class ChangeonelimitsComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeoneLimit!: FormGroup;
  itemsAsObjects : any[] = [];
  VendedorData: any[] = [];
  items: any[]= [];
  inputText = 'text';
  
    ///constructor
  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,
    private limitSvc: LimitService,
    private alertSvc: AlertService,
    private el : ElementRef,
    private userSvc: UsersService) { 
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
    this.formChangeoneLimit = this.initForms(); 
    this.loadDataSeller();
    
  }

 async loadDataSeller() {
    let resp = await this.userSvc.getSellerxNegocio();
    this.VendedorData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeoneLimit.invalid){
      return;
    }
    let listVendedorSelected = this.formChangeoneLimit.value.vendedor;
    let listNumeros = this.formChangeoneLimit.value.numeros;

    let numeros: any[] = [];
    if(listNumeros!==null){
      for (const item of listNumeros) {
        numeros.push(item.value);
      }
    }
  
    let obj ={
      vendedor: listVendedorSelected,
      numero: numeros,
      limite: this.formChangeoneLimit.value.limite
    }
//console.log(obj);

    let Confirmar = this.alertSvc.showConfirmLimit('Cambiar Limite', '¿Está seguro de cambiar el límite del número seleccionado?', 'Confirmar');
    if(await Confirmar){
      let resp = await this.limitSvc.changeoneLimit(obj);
      let { status, message, comment } = resp;
      console.log(resp);
      if(status==200){
        this.alertSvc.showAlert(1, message,comment);
      }else{
        this.alertSvc.showAlert(4, message,'error');
      }
      this.formChangeoneLimit.reset();
      this.onClose.emit(true);
  
    }else{
      this.alertSvc.showAlert(2, 'Cambio de Limite','El cambio de limite fue cancelado por el usuario');
      this.loadDataform();
      this.onClose.emit(true);
    }
   
  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formChangeoneLimit.get(name)?.touched && this.formChangeoneLimit.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      vendedor: ['', [Validators.required]],
      limite: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeoneLimit.reset();
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
        let numeros: any[] = this.formChangeoneLimit?.get('numeros')?.value;

        if ( inputValue === '' || inputValue === null || inputValue == undefined ) {
          return;
        }
        numeros.push({
          display: inputValue,
          value: inputValue
        });
        this.formChangeoneLimit?.get('numeros')?.setValue(numeros);
      });
    } else {
      // Cancelar el evento
      event.preventDefault();
    }
  }

}
