import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-changelimitxseller',
  templateUrl: './changelimitxseller.component.html',
  styleUrls: ['./changelimitxseller.component.scss']
})
export class ChangelimitxsellerComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitexSeller!: FormGroup;
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
    private el: ElementRef,
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
    this.formChangeLimitexSeller = this.initForms();
    this.loadDataSeller();

  }

 async loadDataSeller() {
    let resp = await this.userSvc.getSellerxNegocio();

    this.VendedorData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeLimitexSeller.invalid){
      return;
    }
    let listVendedorSelected = this.formChangeLimitexSeller.value.vendedor;
    let listNumeros = this.formChangeLimitexSeller.value.numeros;

    let vendedor: any[] = [];
    let numeros: any[] = [];
    if(listVendedorSelected!==null){
      for (const item of listVendedorSelected) {
        vendedor.push(item); 
      }
    }
    if(listNumeros!==null){
      for (const item of listNumeros) {
        numeros.push(item.value); 

      }
    }
    let obj ={
      vendedores: vendedor,
      numeros: numeros,
      limite: this.formChangeLimitexSeller.value.limite
    }

    console.log(obj);
    
    let Confirmar = this.alertSvc.showConfirmLimit('Cambiar Limite', '¿Está seguro de cambiar el límite de los números seleccionados?', 'Confirmar');
    if(await Confirmar){
      let resp = await this.limitSvc.changeLimiteNumberxSeller(obj);
      
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
    }else{
      this.alertSvc.showAlert(4, message,'error');
    }
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
    return this.formChangeLimitexSeller.get(name)?.touched && this.formChangeLimitexSeller.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      vendedor: ['', [Validators.required]],
      limite: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeLimitexSeller.reset();
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
        let numeros: any[] = this.formChangeLimitexSeller?.get('numeros')?.value;

        if ( inputValue === '' || inputValue === null || inputValue == undefined ) {
          return;
        }
        numeros.push({
          display: inputValue,
          value: inputValue
        });
        this.formChangeLimitexSeller?.get('numeros')?.setValue(numeros);
      });
    } else {
      // Cancelar el evento
      event.preventDefault();
    }
  }
}
