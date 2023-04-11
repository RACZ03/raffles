import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-changelimitoneseller',
  templateUrl: './changelimitoneseller.component.html',
  styleUrls: ['./changelimitoneseller.component.scss']
})
export class ChangelimitonesellerComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitoneSeller!: FormGroup;
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
    this.formChangeLimitoneSeller = this.initForms();
    this.loadDataSeller();

  }

 async loadDataSeller() {
    let resp = await this.userSvc.getSellerxNegocio();
    this.VendedorData = resp.data;
  }

 async onSubmit(){
    if(this.formChangeLimitoneSeller.invalid){
      return;
    }
    let listVendedorSelected = this.formChangeLimitoneSeller.value.vendedor;

    let obj ={
      vendedor: listVendedorSelected,
      limite: this.formChangeLimitoneSeller.value.limite
    }

    let Confirmar = this.alertSvc.showConfirmLimit('Cambiar Limite', '¿Está seguro de cambiar el límite al vendedor seleccionado?', 'Confirmar');

    if(await Confirmar){
      let resp = await this.limitSvc.changelimitoneseller(obj);
      let { status, message,comment } = resp;
      if(status==200){
        this.alertSvc.showAlert(1, message,comment);
      }else{
        this.alertSvc.showAlert(4, message,'error');
      }
    }else{
      this.alertSvc.showAlert(2, 'Cambio de Limite','El cambio de limite fue cancelado por el usuario');
      this.loadDataform();
      this.onClose.emit(true);
    }


  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formChangeLimitoneSeller.get(name)?.touched && this.formChangeLimitoneSeller.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      vendedor: ['', [Validators.required]],
      limite: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeLimitoneSeller.reset();
  }


}
