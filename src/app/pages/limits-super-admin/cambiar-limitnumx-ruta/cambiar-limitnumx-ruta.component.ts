import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-cambiar-limitnumx-ruta',
  templateUrl: './cambiar-limitnumx-ruta.component.html',
  styleUrls: ['./cambiar-limitnumx-ruta.component.scss']
})
export class CambiarLimitnumxRutaComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimiteXroute!: FormGroup;
  itemsAsObjects : any[] = [];
  rutasData: any[] = [];
  items: any[]= [];
  inputText = 'text';
  isConfirmed = false;
  private idNegocio: any;
  public negocioData: any[] = [];


    ///constructor
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private negocioSvr : BusinessService,
    private routeSvc: RouteService,
    private limitSvc: LimitService,
    private alertSvc: AlertService) {
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
    this.formChangeLimiteXroute = this.initForms();
    this.BuscaUltimoNegocio();
  }

 async loadDataRutaa(id: any) {
     let resp = await this.routeSvc.getRoutesByIdBusiness(id);
     this.rutasData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeLimiteXroute.invalid){
      return;
    }
   
    let listRutasSelected = this.formChangeLimiteXroute.value.rutas;
    let listNumeros = this.formChangeLimiteXroute.value.numeros;

    //console.log(listRutasSelected);

    let rutas: any[]= [];
    let numeros: any[] = [];
    if(listRutasSelected!==null){
      for (const item of listRutasSelected) {
        rutas.push(item);
      }
    }

    if(listNumeros!==null){
      for (const item  of listNumeros) {
        numeros.push(item.value);
      }
    }
    let obj ={
      rutas: rutas,
      numeros: numeros,
      limite: this.formChangeLimiteXroute.value.limite
    }
  

    let resp = this.alertSvc.showConfirmLimit('Cambiar Limite', '¿Está seguro de cambiar el límite de los números seleccionados?', 'Confirmar');
   
    if(await resp){
    let resp = await this.limitSvc.changeLimiteNumberRoute(obj);

    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
    }else{
      this.alertSvc.showAlert(4, message,'error');
    }
   }else{
    this.alertSvc.showAlert(2, 'Cambio de Limite','El cambio de limite fue cancelado por el usuario');
   
    this.onClose.emit(true);
  }    
  this.loadDataform();
  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formChangeLimiteXroute.get(name)?.touched && this.formChangeLimiteXroute.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      rutas: ['', [Validators.required]],
      limite: ['', [Validators.required]],
      negocio: ['', [Validators.required]]
    })
  }

  loadDataform(){
    this.formChangeLimiteXroute.reset();
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
        let numeros: any[] = this.formChangeLimiteXroute?.get('numeros')?.value;

        if ( inputValue === '' || inputValue === null || inputValue == undefined ) {
          return;
        }
        numeros.push({
          display: inputValue,
          value: inputValue
        });
        this.formChangeLimiteXroute?.get('numeros')?.setValue(numeros);
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
    this.loadDataRutaa(this.idNegocio);

    this.formChangeLimiteXroute.patchValue({
      negocio: this.idNegocio
    });
  }

  cambiaNegocio(){
    this.setValue();
    this.loadDataRutaa(this.formChangeLimiteXroute.value.negocio);
  }

  setValue(){
    this.formChangeLimiteXroute.patchValue({
      limite: '',
      ruta: '',
      numeros: ''
    });
  }

}
