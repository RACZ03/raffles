import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {  MatDialogRef } from '@angular/material/dialog';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-awward-especial',
  templateUrl: './add-awward-especial.component.html',
  styleUrls: ['./add-awward-especial.component.scss']
})
export class AddAwwardEspecialComponent implements OnInit {

  public premiosListEspecial: any[] = [];
  public premioListCompletEspecial: any[] = [];
  public dataIdentity: any;
  awardFormEspecial : any;
  public dataEspecial: any[] = [];


  constructor(
    public alertSvc: AlertService,
    public awwardSvr: awarCatalogService,
    public dialogRef: MatDialogRef<AddAwwardEspecialComponent>,
    public fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    if( this.awardFormEspecial ===  undefined ) {
      this.awardFormEspecial = this.initForm();
    }
    this.loadListPremiosEspecial();
  }

  async loadListPremiosEspecial() {
    let resp = await this.awwardSvr.getAwardCatalog();
    this.dataEspecial = [];
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        for (const item of data) {
          if(item.especial){
            this.dataEspecial.push(item);
          }
        }
      }
    }
  }

  closeEspecial(): void {
    this.dialogRef.close();
  }

  async onSubmitEspecial(){
    if(this.premiosListEspecial.length == 0){
      this.alertSvc.showAlert(4,'Error','Debe agregar al menos un premio');
      return;
    }

    ///storage
  this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
  for (let i = 0; i < this.premiosListEspecial.length; i++) {
      this.premioListCompletEspecial[i].idNegocio = this.dataIdentity.idNegocio;
      this.premioListCompletEspecial[i].especial = true;
      this.premioListCompletEspecial[i].premio = this.premiosListEspecial[i].premio;
      this.premioListCompletEspecial[i].monto = this.premiosListEspecial[i].monto;
  }

    let resp = await this.awwardSvr.addAwarCatalogo(this.premioListCompletEspecial);

    if ( resp ) {
      let {comment, status} = resp;
      if(status == 200){
        this.alertSvc.showAlert(1,'Exito',comment);
        this.closeEspecial();
      }else{
        this.alertSvc.showAlert(4,'Error','No se pudo agregar debido a un numero de la lista ya se encuentra registrado');
      }
    } else {
      this.alertSvc.showAlert(4,'Error','No se pudo agregar');
    }

  }
    /* SECTION VALIDATIONS */
    validInput(name: string) {
      return this.awardFormEspecial.get(name)?.touched && this.awardFormEspecial.get(name)?.errors?.['required'];
    }

    // Form
    initForm(): FormGroup {
      return this.fb.group({
        monto: [''],
        premio: [''],
      });
    }

    eliminarRegistroEspecial(item:any){
      for (const i of this.premiosListEspecial) {
        if(i.monto == item.monto){
          this.premiosListEspecial.splice(this.premiosListEspecial.indexOf(i),1);
        }
      }
    }

    busqueda(){
      let dato =0;
      for (const item of this.dataEspecial) {
        if(item.monto == this.awardFormEspecial.get('monto')?.value){
          dato = 1;
        }
      }
      if(dato == 1){
        return true;
      }else{
        return false;
      }
    }


    addListPremioEspecial(){
      if(this.awardFormEspecial.get('premio')?.value == '' || this.awardFormEspecial.get('monto')?.value == ''){
        this.alertSvc.showAlert(4,'Error','Debe llenar los campos para agregar a la lista');
        return;
      }
      if(this.premiosListEspecial.length > 0){
        for (const item of this.premiosListEspecial) {
          if(item.monto == this.awardFormEspecial.get('monto')?.value){
            this.alertSvc.showAlert(4,'Error','El monto ya existe en la lista');
            this.awardFormEspecial.get('monto')?.setValue('');
            this.awardFormEspecial.get('premio')?.setValue('');
            return;
          }
        }
      }


    if(this.busqueda()){
      this.alertSvc.showAlert(3,'Error','El monto ya se encuentra registrado');
      this.awardFormEspecial.get('monto')?.setValue('');
      this.awardFormEspecial.get('premio')?.setValue('');
      return;
    }

    this.premioListCompletEspecial.push({
      monto: this.awardFormEspecial.get('monto')?.value,
      premio: this.awardFormEspecial.get('premio')?.value,
    });

    this.premiosListEspecial = this.premioListCompletEspecial;
    this.awardFormEspecial.get('monto')?.setValue('');
    this.awardFormEspecial.get('premio')?.setValue('');
  }

}
