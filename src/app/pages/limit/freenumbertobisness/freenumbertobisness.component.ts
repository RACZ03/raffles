import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
    private businessSvc: BusinessService,)
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
    this.loadDataBusiness();
    
  }

 async loadDataBusiness() {

     let resp = await this.businessSvc.getBusiness();
    //console.log(resp);
      this.BusinessData = resp.data;
  }

 async onSubmit(){
    if(this.formfreeNumberToBusiness.invalid){
      return;
    }
    let listbusinessSelected = this.formfreeNumberToBusiness.value.negocios;
    let listNumeros = this.formfreeNumberToBusiness.value.numeros;

    console.log(this.formfreeNumberToBusiness.value);
    let numeros: any[] = [];
    let business: any[] = [];
    if(listbusinessSelected!==null){
      for(let i=0; i<listbusinessSelected.length; i++){
        business.push(listbusinessSelected[i]);
      }
    }

    if(listNumeros!==null){
      for(let i=0; i<listNumeros.length; i++){
        numeros.push(listNumeros[i].value);
      }
    }
  
    let obj ={
      vendedoresOrRutaOrNegocio: business,
      numeros: numeros,
    }
     //console.log(obj);
    let resp = await this.limitSvc.freeNumberToBusiness(obj);
    //console.log(resp);
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
      this.formfreeNumberToBusiness.reset();
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

}
