import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-freenumbertoseller',
  templateUrl: './freenumbertoseller.component.html',
  styleUrls: ['./freenumbertoseller.component.scss']
})
export class FreenumbertosellerComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formfreeNumberToSeller!: FormGroup;
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
    this.formfreeNumberToSeller = this.initForms(); 
    this.loadDataSeller();
    
  }

 async loadDataSeller() {
    let resp = await this.userSvc.getSellerxNegocio();
    //console.log(resp);
    this.VendedorData = resp.data;
  }

 async onSubmit(){
    if(this.formfreeNumberToSeller.invalid){
      return;
    }
    let listVendedorSelected = this.formfreeNumberToSeller.value.vendedor;
    let listNumeros = this.formfreeNumberToSeller.value.numeros;
    //console.log(this.formChangeLimitexSeller.value);
    let numeros: any[] = [];
    let vendedor: any[] = [];
    if(listVendedorSelected!==null){
      for(let i=0; i<listVendedorSelected.length; i++){
        vendedor.push(listVendedorSelected[i].value);
      }
    }

    if(listNumeros!==null){
      for(let i=0; i<listNumeros.length; i++){
        numeros.push(listNumeros[i].value);
      }
    }
  
    let obj ={
      vendedoresOrRutaOrNegocio: vendedor,
      numeros: numeros,
    }
     //console.log(obj);
    let resp = await this.limitSvc.freeNumberToSeller(obj);
    //console.log(resp);
    let { status, message,comment } = resp;
    if(status==200){
      this.alertSvc.showAlert(1, message,comment);
      this.formfreeNumberToSeller.reset();
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
    return this.formfreeNumberToSeller.get(name)?.touched && this.formfreeNumberToSeller.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      vendedor: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formfreeNumberToSeller.reset();
  } 

}
