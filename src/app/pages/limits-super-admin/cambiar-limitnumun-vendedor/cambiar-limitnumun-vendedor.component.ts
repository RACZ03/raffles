import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-cambiar-limitnumun-vendedor',
  templateUrl: './cambiar-limitnumun-vendedor.component.html',
  styleUrls: ['./cambiar-limitnumun-vendedor.component.scss']
})
export class CambiarLimitnumunVendedorComponent implements OnInit {

  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimitoneSeller!: FormGroup;
  itemsAsObjects : any[] = [];
  VendedorData: any[] = [];
  public negocioData: any[] = [];
  items: any[]= [];
  inputText = 'text';
 public idNegocio: any;

    ///constructor
  constructor(
    private fb: FormBuilder,
    private negocioSvr : BusinessService,
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
    this.BuscaUltimoNegocio();
 
  }

 async loadDataSeller(id : any) {
    let resp = await this.userSvc.getSellerxNegocioSAD(id);
    let { status, message, data } = resp;
    if(status==200){
      this.VendedorData = data;
    }else{
      this.alertSvc.showAlert(4, message,'error');
    }
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
    }
    
    this.loadDataform();

  }

  closeModal(band: boolean) {
    this.loadDataform();
    this.BuscaUltimoNegocio();
    this.onClose.emit(band);
  }

  validInput(name: string) {
    return this.formChangeLimitoneSeller.get(name)?.touched && this.formChangeLimitoneSeller.get(name)?.errors?.['required'];
  }


  initForms(): FormGroup {
    return this.fb.group({
      negocio : ['', [Validators.required]],
      vendedor: ['', [Validators.required]],
      limite: ['', [Validators.required]],
    })
  }

  loadDataform(){
    this.formChangeLimitoneSeller.reset();
    this.BuscaUltimoNegocio();
  }


async BuscaUltimoNegocio(){  
    let resp = await this.negocioSvr.getBusiness();
    let { data } = resp;
    this.idNegocio = data[0].id;
    this.negocioData = data;
    this.loadDataSeller(this.idNegocio);

    this.formChangeLimitoneSeller.patchValue({
      negocio: this.idNegocio
    });
  }

  cambiaNegocio(){
    this.setValue();
    this.loadDataSeller(this.formChangeLimitoneSeller.value.negocio);
  }

  setValue(){
    this.formChangeLimitoneSeller.patchValue({
      limite: '',
      vendedor: '',
    });
  }

}
