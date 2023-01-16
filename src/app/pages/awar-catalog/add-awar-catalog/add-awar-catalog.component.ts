import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-awar-catalog',
  templateUrl: './add-awar-catalog.component.html',
  styleUrls: ['./add-awar-catalog.component.scss']
})
export class AddAwarCatalogComponent implements OnInit {

  public isEdit: boolean = false;
  awardForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();
  
  public businessSelected: any = null;
  @Input() set award(value: any) {
    // console.log(value);
    if (value != null) {
      this.awardForm = this.initForm();
      this.loadForm(value);
    }
  }

 // public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private awwardSvr: awarCatalogService,
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    if ( this.awardForm ===  undefined ) {
      this.awardForm = this.initForm();
    }
  }

  
  async onSubmit() {
    if (this.awardForm.invalid) {
      return Object.values(this.awardForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.awwardSvr.addAwarCatalogo(this.awardForm.value, this.isEdit);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', 'Registro guardado');
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(4, 'Error', 'No se pudo guardar el registro');
    }

  }
  loadForm(data: any) {
    if ( this.awardForm ===  undefined ) {
      return;
    }

    this.awardForm.patchValue({
      id: data?.id,
      nombre: data?.nombre,
      descripcion: data?.descripcion,
    });
    this.isEdit = true;
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.awardForm.get(name)?.touched && this.awardForm.get(name)?.errors?.['required'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [],
    });
  }

  close() {
    this.goBack.emit(false);
  }



}
