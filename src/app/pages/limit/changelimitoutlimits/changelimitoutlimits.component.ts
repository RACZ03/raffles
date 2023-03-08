import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-changelimitoutlimits',
  templateUrl: './changelimitoutlimits.component.html',
  styleUrls: ['./changelimitoutlimits.component.scss']
})
export class ChangelimitoutlimitsComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitOutLimit!: FormGroup;
  itemsAsObjects : any[] = [];
  limitList:any[] = [];
  SellerData: any[] = [];
  items: any[]= [];
  listSinAfectar: any[] = [];
  inputText = 'text';
  
  
    ///constructor
  constructor(
    private fb: FormBuilder,
    private limitSvc: LimitService,
    private alertSvc: AlertService,
    private sellerSvc: UsersService,)
     { 
    }

 //OnInit
   ngOnInit(): void {
    this.formChangeLimitOutLimit = this.initForms(); 
    this.loadDataSeller();
    
  }

 async loadDataSeller() {
     let resp = await this.sellerSvc.getSellerxNegocio();

     this.SellerData = resp.data;
  }

 async onSubmit(){
    if(this.limitList.length == 0){
      this.alertSvc.showAlert(4,'Error','Debe agregar al menos un limite');
      return;
    }
    
   for (const item of this.limitList) {
    let obj = {
      vendedor: item.seller.id,
      premioMaximmo : item.premioMaximmo
    }
    this.listSinAfectar.push(obj);
   }

    let resp = await this.limitSvc.changelimitsinafectarLimit(this.listSinAfectar);
    let { status, message,comment } = resp;
    if(status == 200){
      this.alertSvc.showAlert(1,message,comment);
      this.limitList = [];
      this.closeModal(true);
    }else{
      this.alertSvc.showAlert(4,message,comment);
    } 
    this.loadDataform();
  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }



  addLimitOutLimit() {
    if(this.formChangeLimitOutLimit.get('vendedor')?.value == '' || this.formChangeLimitOutLimit.get('premioMaximmo')?.value == ''){
      this.alertSvc.showAlert(4,'Error','Debe llenar los campos para agregar a la lista');
      return;
    }
    if(this.limitList.length > 0){
      for (const item of this.limitList) {
        if(item.seller.id == this.formChangeLimitOutLimit.get('vendedor')?.value){
          this.alertSvc.showAlert(4,'Error','El vendedor ya se encuentra en la lista');
          this.formChangeLimitOutLimit.get('vendedor')?.setValue('');
          this.formChangeLimitOutLimit.get('premioMaximmo')?.setValue('');
          return;
        } 
      }
    }

    for (const item of this.SellerData) {
      if(item.id == this.formChangeLimitOutLimit.get('vendedor')?.value){
        const limites = {
          seller: item,
          premioMaximmo: this.formChangeLimitOutLimit.get('premioMaximmo')?.value
       }
       this.limitList.push(limites);
      }
      
    }
  this.formChangeLimitOutLimit.get('vendedor')?.setValue('');
  this.formChangeLimitOutLimit.get('premioMaximmo')?.setValue('');
  }


  eliminarRegistro(items:any){
    for(let i = 0; i < this.limitList.length; i++){
      if(this.limitList[i].seller.id == items.seller.id){
        this.limitList.splice(i,1);
      }
    }

  }

  validInput(name: string) {
    return this.formChangeLimitOutLimit.get(name)?.touched && this.formChangeLimitOutLimit.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      premioMaximmo: ['', []],
      vendedor: ['', []],
      limits:[[], [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeLimitOutLimit.reset();
  }

}
