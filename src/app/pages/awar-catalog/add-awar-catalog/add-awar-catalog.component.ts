import { Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { AddAwwardEspecialComponent } from '../add-awward-especial/add-awward-especial.component';

@Component({
  selector: 'app-add-awar-catalog',
  templateUrl: './add-awar-catalog.component.html',
  styleUrls: ['./add-awar-catalog.component.scss']
})
export class AddAwarCatalogComponent implements OnInit {
  public dataIdentity: any;

  public isEdit: boolean = false;
  public premiosList: any[] = [];
  public premioListComplet: any[] = [];
  public dataNormal: any[] = [];
  awardForm!: FormGroup;
  
  public businessSelected: any = null;

  constructor(
    private fb: FormBuilder,
    private awwardSvr: awarCatalogService,
    private alertSvc: AlertService,
    public dialogRef: MatDialogRef<AddAwwardEspecialComponent>,
  ) { }

  ngOnInit(): void {
    if ( this.awardForm ===  undefined ) {
      this.awardForm = this.initForm();
    }
    this.loadListPremios();
  }

  async loadListPremios() {
    let resp = await this.awwardSvr.getAwardCatalog();
    this.dataNormal = [];
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        for (const item of data) {
          if(!item.especial){
            this.dataNormal.push(item);
          }
        }
      }
    }

  }

async onSubmit() {
    if(this.premiosList.length == 0){
      this.alertSvc.showAlert(4,'Error','Debe agregar al menos un premio');
      return;
    }

    ///storage
 this.dataIdentity= JSON.parse(localStorage.getItem('business') || '{}');
 for (let i = 0; i < this.premiosList.length; i++) {
    this.premioListComplet[i].idNegocio = this.dataIdentity.idNegocio;
    this.premioListComplet[i].especial = false;
    this.premioListComplet[i].premio = this.premiosList[i].premio;
    this.premioListComplet[i].monto = this.premiosList[i].monto;
 }

    let resp = await this.awwardSvr.addAwarCatalogo(this.premioListComplet);
    console.log(resp);
    let {comment, status} = resp;
    if(status == 200){
      this.alertSvc.showAlert(1,'Exito',comment);
      this.close();
    }else{
      this.alertSvc.showAlert(4,'Error','No se pudo agregar debido a un numero de la lista ya se encuentra registrado');
    }

 
  }
  

  close() {
    this.dialogRef.close();
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.awardForm.get(name)?.touched && this.awardForm.get(name)?.errors?.['required'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      monto: [''],
      premio: [''],
    });
  }

  eliminarRegistro(item:any){
      for (const i of this.premiosList) {
        if(i.monto == item.monto){
          this.premiosList.splice(this.premiosList.indexOf(i),1);
        }
      }
  }

  busqueda(){
  let dato =0;
    for (const item of this.dataNormal) {
      if(item.monto == this.awardForm.get('monto')?.value){
        dato = 1;
      }   
    }
    if(dato == 1){
      return true;
    }else{
      return false;
    }
  }

  addListPremio(){
    if(this.awardForm.get('premio')?.value == '' || this.awardForm.get('monto')?.value == ''){
      this.alertSvc.showAlert(4,'Error','Debe llenar los campos para agregar a la lista');
      return;
    }

    if(this.premiosList.length > 0){
        for (const item of this.premiosList) {
          if(item.monto == this.awardForm.get('monto')?.value){
            this.alertSvc.showAlert(4,'Error','El monto ya existe en la lista');
            this.awardForm.get('monto')?.setValue('');
            this.awardForm.get('premio')?.setValue('');
            return;
          }
        }
    }

    if(this.busqueda()){
      this.alertSvc.showAlert(3,'Error','El monto ya se encuentra registrado');
      this.awardForm.get('monto')?.setValue('');
      this.awardForm.get('premio')?.setValue('');
      return;
    }
       
     
      this.premioListComplet.push({
        monto: this.awardForm.get('monto')?.value,
        premio: this.awardForm.get('premio')?.value,
      });

      this.premiosList = this.premioListComplet;
      console.log(this.premiosList);
      this.awardForm.get('monto')?.setValue('');
      this.awardForm.get('premio')?.setValue('');
    }
   



  }
