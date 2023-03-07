import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-freenumbertoroute',
  templateUrl: './freenumbertoroute.component.html',
  styleUrls: ['./freenumbertoroute.component.scss']
})
export class FreenumbertorouteComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formfreeNumberToRoute!: FormGroup;
  itemsAsObjects : any[] = [];
  RutasData: any[] = [];
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
    this.formfreeNumberToRoute = this.initForms(); 
    this.loadDataSeller();
    
  }

 async loadDataSeller() {
  let dataIdentity = JSON.parse(localStorage.getItem('business') || '{}');
    let resp = await this.routeSvc.getRoutesByIdBusiness(dataIdentity.idNegocio);
    this.RutasData = resp.data;
  }

 async onSubmit(){
    if(this.formfreeNumberToRoute.invalid){
      return;
    }
    let listRouteSelected = this.formfreeNumberToRoute.value.rutas;
    let listNumeros = this.formfreeNumberToRoute.value.numeros;

    console.log(this.formfreeNumberToRoute.value);
    let numeros: any[] = [];
    let Route: any[] = [];
    if(listRouteSelected!==null){
      for (const item of listRouteSelected) {
        Route.push(item);
      }
    }

    if(listNumeros!==null){
      for (const item of listNumeros) {
        numeros.push(item.value);
      }
    }
  
    let obj ={
      vendedoresOrRutaOrNegocio: Route,
      numeros: numeros,
    }

    let Confirmar = this.alertSvc.showConfirmLimit('Liberar Numeros', '¿Está seguro de cliberar los números seleccionados?', 'Confirmar');
    if(await Confirmar){
      let resp = await this.limitSvc.freeNumberToRoute(obj);
      let { status, message,comment } = resp;
      if(status==200){
        this.alertSvc.showAlert(1, message,comment);
        this.formfreeNumberToRoute.reset();
        this.closeModal(true);
      }else{
        this.alertSvc.showAlert(4, message,'error');
      }
    }
    else{
      this.alertSvc.showAlert(2, 'Cambio de Limite','La liberacion de numeros fue cancelado por el usuario');
      this.loadDataform();
      this.onClose.emit(true);
    }

    
  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formfreeNumberToRoute.get(name)?.touched && this.formfreeNumberToRoute.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      rutas: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formfreeNumberToRoute.reset();
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
        let numeros: any[] = this.formfreeNumberToRoute?.get('numeros')?.value;

        if ( inputValue === '' || inputValue === null || inputValue == undefined ) {
          return;
        }
        numeros.push({
          display: inputValue,
          value: inputValue
        });
        this.formfreeNumberToRoute?.get('numeros')?.setValue(numeros);
      });
    } else {
      // Cancelar el evento
      event.preventDefault();
    }
  }

}
