import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    //console.log(resp);
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
      for(let i=0; i<listRouteSelected.length; i++){
        Route.push(listRouteSelected[i]);
      }
    }

    if(listNumeros!==null){
      for(let i=0; i<listNumeros.length; i++){
        numeros.push(listNumeros[i].value);
      }
    }
  
    let obj ={
      vendedoresOrRutaOrNegocio: Route,
      numeros: numeros,
    }
     //console.log(obj);
    let resp = await this.limitSvc.freeNumberToRoute(obj);
    //console.log(resp);
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
      this.formfreeNumberToRoute.reset();
      this.closeModal(true);
    }else{
      this.alertSvc.showAlert(4, message,'error');
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

}
