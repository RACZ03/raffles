import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  inputText = 'text';
  
  
    ///constructor
  constructor(
    private fb: FormBuilder,
    private limitSvc: LimitService,
    private alertSvc: AlertService,
    private sellerSvc: UsersService,)
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
    this.formChangeLimitOutLimit = this.initForms(); 
    this.loadDataSeller();
    
  }

 async loadDataSeller() {

     let resp = await this.sellerSvc.getSellerxNegocio();
    //console.log(resp);
     this.SellerData = resp.data;
  }

 async onSubmit(){
   
  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  get limits(): FormArray {
    return this.formChangeLimitOutLimit.get('limits') as FormArray;
  }

  addLimitOutLimit() {
    

    if(this.limits.controls[0].invalid){
      this.limits.controls[0].markAllAsTouched();
      this.alertSvc.showAlert(3, 'Error', 'Debe ingresar un valor');
      return;
    }

    console.log(this.limits.controls[0].value);
    this.limitList.push(this.limits.controls[0].value);
  }

  validInput(name: string) {
    return this.formChangeLimitOutLimit.get(name)?.touched && this.formChangeLimitOutLimit.get(name)?.errors?.['required'];
  }

  initLimitForm(): FormGroup {
    return this.fb.group({
      premioMaximmo: ['', []],
      vendedor: ['', []],
    })
  }

  initForms(): FormGroup {
    return this.fb.group({
      limits: this.fb.array([
        this.initLimitForm()
      ]),

    })
  }

  loadDataform(){
    this.formChangeLimitOutLimit.reset();
  }

}
