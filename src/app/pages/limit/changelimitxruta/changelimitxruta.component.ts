import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { type } from 'os';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { AlertService } from 'src/app/@core/utils/alert.service';


@Component({
  selector: 'app-changelimitxruta',
  templateUrl: './changelimitxruta.component.html',
  styleUrls: ['./changelimitxruta.component.scss']
})
export class ChangelimitxrutaComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimiteXroute!: FormGroup;
  itemsAsObjects : any[] = [];
  rutasData: any[] = [];
  items: any[]= [];
  inputText = 'text';

    ///constructor
  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
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
    this.loadDataRutaa();
    console.log('Hi')
  }

 async loadDataRutaa() {

  let dataIdentity = JSON.parse(localStorage.getItem('business') || '{}');
  //console.log(dataIdentity, "aqui");
     let resp = await this.routeSvc.getRoutesByIdBusiness(dataIdentity.idNegocio);
     //console.log(resp);
     this.rutasData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeLimiteXroute.invalid){
      return;
    }
    let listRutasSelected = this.formChangeLimiteXroute.value.rutas;
    let listNumeros = this.formChangeLimiteXroute.value.numeros;
    //console.log(listNumeros);
    let rutas: any[] = [];
    let numeros: any[] = [];
    if(listRutasSelected!==null){
      for(let i=0; i<listRutasSelected.length; i++){
        rutas.push(listRutasSelected[i]);
      }
    }
    if(listNumeros!==null){
      for(let i=0; i<listNumeros.length; i++){
        numeros.push(listNumeros[i].value);
      }
    }
    let obj ={
      rutas: rutas,
      numeros: numeros,
      limite: this.formChangeLimiteXroute.value.limite
    }

    let resp = await this.limitSvc.changeLimiteNumberRoute(obj);
    //console.log(resp);
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
    }else{
      this.alertSvc.showAlert(4, message,'error');
    }
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
    })
  }

  loadDataform(){
    this.formChangeLimiteXroute.reset();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.key;
    const inputValue = this.el.nativeElement.value;
    // Solo permitir dígitos numéricos, retroceso, borrar y flechas
    if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39 || /^\d+$/.test(input)) {
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
      return;
    } else {
      // Cancelar el evento
      event.preventDefault();
    }
  }
}


