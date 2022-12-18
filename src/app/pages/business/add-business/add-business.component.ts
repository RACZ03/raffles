import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {

  public isEdit: boolean = false;
  businessForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();
  
  public businessSelected: any = null;
  @Input() set business(value: any) {
    console.log(value);
    if (value != null) {
      this.businessForm = this.initForm();
      this.loadForm(value);
    }
  }

  public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private businessSvc: BusinessService,
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    if ( this.businessForm ===  undefined ) {
      this.businessForm = this.initForm();
    }
  }

  async onSubmit() {
    if (this.businessForm.invalid) {
      return Object.values(this.businessForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.businessSvc.add(this.businessForm.value, this.isEdit);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', 'Registro guardado');
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(4, 'Error', 'No se pudo guardar el registro');
    }

  }

  loadForm(data: any) {
    if ( this.businessForm ===  undefined ) {
      return;
    }

    this.businessForm.patchValue({
      id: data?.id,
      nombre: data?.nombre,
      telefono: data?.telefono,
      email: data?.email,
      direccion: data?.direccion,
    });
    this.isEdit = true;
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.businessForm.get(name)?.touched && this.businessForm.get(name)?.errors?.['required'];
  }

  validEmail(name: string) {
    return this.businessForm.get(name)?.touched && this.businessForm.get(name)?.errors?.['pattern'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      email: ['', {
        validators: [
          Validators.pattern(this.emailRegex),
        ],
        updateOn: 'blur'
      }],
      direccion: ['']
    });
  }

  close() {
    this.goBack.emit(false);
  }


}
