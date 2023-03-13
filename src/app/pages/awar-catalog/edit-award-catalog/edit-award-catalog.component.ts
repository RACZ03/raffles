import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-edit-award-catalog',
  templateUrl: './edit-award-catalog.component.html',
  styleUrls: ['./edit-award-catalog.component.scss']
})
export class EditAwardCatalogComponent implements OnInit {
  awardFormEdit: any;
  public disabled= true;

  constructor(
    public dialogRef: MatDialogRef<EditAwardCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public awardServ: awarCatalogService,
    public alertSvc: AlertService
  ) { 
  
  }

  ngOnInit(): void {
    this.awardFormEdit = this.initForm();
    this.loadData(this.data);
  }

  async onSubmitEdit(){
   let confirm =  this.alertSvc.showConfirmLimit('Actualizar Premio','¿Estas seguro de editar este premio?', 'Editar',)
    if(await confirm){
      if(this.awardFormEdit.valid){
        let obj = {
          idNegocio: this.data?.premio?.idNegocio,
          especial: this.data?.premio?.especial,
          monto: this.awardFormEdit.value.monto,
          premio: this.awardFormEdit.value.premio,
      }
       let resp =  await this.awardServ.updateCatalogPremioxId(this.data?.premio?.id, obj);
        let { status, comment } = resp;
        if(status == 200){
          this.alertSvc.showAlert(1,'Exito', comment);
          this.close();
        }
      }
    }else{
      this.alertSvc.showAlert(3,'Edicion cancelada', 'Premio no editado');
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

    /* SECTION VALIDATIONS */
      validInput(name: string) {
        return this.awardFormEdit.get(name)?.touched && this.awardFormEdit.get(name)?.errors?.['required'];
      }

      loadData(data: any){
        this.awardFormEdit.patchValue({
          id: data?.premio?.id,
          idNegocio: data?.premio?.idNegocio,
          especial: data?.premio?.especial,
          monto: data?.premio?.monto,
          premio: data?.premio?.premio,
        });
      }
  
    // Form
    initForm(): FormGroup {
      return this.fb.group({
        monto: ['' , [Validators.required]],
        premio: ['' , [Validators.required, Validators.pattern('^[0-9]*$')]],
      });
    }

}
