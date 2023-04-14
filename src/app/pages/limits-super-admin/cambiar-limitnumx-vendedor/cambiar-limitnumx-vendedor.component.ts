import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-cambiar-limitnumx-vendedor',
  templateUrl: './cambiar-limitnumx-vendedor.component.html',
  styleUrls: ['./cambiar-limitnumx-vendedor.component.scss']
})
export class CambiarLimitnumxVendedorComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitexSeller!: FormGroup;
  itemsAsObjects : any[] = [];
  VendedorData: any[] = [];
  items: any[]= [];
  inputText = 'text';
  negocioData: any[] = [];
  private idNegocio: any;


    ///constructor
  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,
    private negocioSvr : BusinessService,
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
    this.BuscaUltimoNegocio();
  }

 async loadDataSeller(id: any) {
    let resp = await this.userSvc.getSellerxNegocioSAD(id);
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

   // console.log(obj);
    
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
    this.loadDataform();    
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
      negocio: ['', [Validators.required]]
    })
  }

  loadDataform(){
    this.formChangeLimitexSeller.reset();
    this.BuscaUltimoNegocio();
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

  async BuscaUltimoNegocio(){  
    let resp = await this.negocioSvr.getBusiness();
    let { data } = resp;
    this.idNegocio = data[0].id;
    this.negocioData = data;
    this.loadDataSeller(this.idNegocio);

    this.formChangeLimitexSeller.patchValue({
      negocio: this.idNegocio
    });
  }

  cambiaNegocio(){
    this.setValue();
    this.loadDataSeller(this.formChangeLimitexSeller.value.negocio);
  }

  setValue(){
    this.formChangeLimitexSeller.patchValue({
      limite: '',
      ruta: '',
      numeros: ''
    });
  }

}
