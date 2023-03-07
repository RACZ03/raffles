import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-changelimitxseller',
  templateUrl: './changelimitxseller.component.html',
  styleUrls: ['./changelimitxseller.component.scss']
})
export class ChangelimitxsellerComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitexSeller!: FormGroup;
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
    this.formChangeLimitexSeller = this.initForms();
    this.loadDataSeller();

  }

 async loadDataSeller() {
    let resp = await this.userSvc.getSellerxNegocio();

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
    if(listVendedorSelected!==null) {
      for (const item of listVendedorSelected) {
        vendedor.push(item);
      }
    }
    if(listNumeros!==null) {
      for (const item of listNumeros) {
        numeros.push(item.val);
      }
    }
    console.log(vendedor);
    let obj ={
      vendedores: vendedor,
      numeros: numeros,
      limite: this.formChangeLimitexSeller.value.limite
    }

    let resp = await this.limitSvc.changeLimiteNumberxSeller(obj);
    console.log(resp);
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
    return this.formChangeLimitexSeller.get(name)?.touched && this.formChangeLimitexSeller.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      numeros: ['', [Validators.required]],
      vendedor: ['', [Validators.required]],
      limite: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeLimitexSeller.reset();
  }
}
