import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    //console.log(resp);
    this.VendedorData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeoneLimit.invalid){
      return;
    }
    let listVendedorSelected = this.formChangeoneLimit.value.vendedor;
    let listNumeros = this.formChangeoneLimit.value.numeros;
    //console.log(this.formChangeLimitexSeller.value);
    let numeros: any[] = [];
    if(listNumeros!==null){
      for(let i=0; i<listNumeros.length; i++){
        numeros.push(listNumeros[i].value);
      }
    }
  
    let obj ={
      vendedor: listVendedorSelected,
      numero: numeros,
      limite: this.formChangeoneLimit.value.limite
    }
     //console.log(obj);
    let resp = await this.limitSvc.changeoneLimit(obj);
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

}
