import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { UploadImageService } from 'src/app/@core/services/upload-image.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit, OnDestroy {

  public isEdit: boolean = false;
  public isCancel: boolean = false;
  businessForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();

  public businessSelected: any = null;
  @Input() set business(value: any) {
    if (value != null) {
      this.businessForm = this.initForm();
      this.loadForm(value);
    }
  }

  public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public logo: string = '';

  constructor(
    private fb: FormBuilder,
    private businessSvc: BusinessService,
    private alertSvc: AlertService,
    public updloadSvc: UploadImageService
  ) { }

  ngOnInit(): void {
    if ( this.businessForm ===  undefined ) {
      this.businessForm = this.initForm();
    }
  }

  ngOnDestroy(): void {
    // destroy form
    this.businessForm = this.initForm();
    // remove image if logo is not empty
    if (this.logo != '' && !this.isCancel && !this.isEdit) {
      this.onRemoveImage();
    }
  }

  onSelectedFile() {
    // click input file
    document.getElementById('file')?.click();
  }

  async onUploadImage(e: any) {
    let file = e.target.files[0];

    // is image format valid png
    if (file.type != 'image/png') {
      this.alertSvc.showAlert(4, 'Error', 'Formato de imagen no valido');
      return;
    }

    let resp = await this.updloadSvc.onUpload('business', file);
    this.logo = resp;

    setTimeout(() => {
      this.updloadSvc.uploadPercent = new BehaviorSubject(0);
    }, 300);
  }

  async onRemoveImage() {
    // validate if logo is not empty
    if (this.logo == '') {
      return;
    }

    // validate if logo include http or https
    if (this.logo.includes('http') || this.logo.includes('https')) {
      let resp = await this.updloadSvc.delete(this.logo);
      this.logo = '';
    }

  }

  async onSubmit() {
    this.isCancel = true;
    if (this.businessForm.invalid) {
      return Object.values(this.businessForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // add logo to form
    if (this.logo != '') {

      this.businessForm.get('logo')?.setValue(this.logo);
    }

    let resp = await this.businessSvc.add(this.businessForm.value, this.isEdit);
    let { status } = resp;
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
      logo: data?.logo,
    });
    this.isEdit = true;

    // set logo
    if ( data?.logo != null || data?.logo != '' ) {
      // validate if logo include http or https
      if (data?.logo.includes('http') || data?.logo.includes('https')) {
        this.logo = data?.logo;
      }
    }
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
      direccion: [''],
      logo: [''],
    });
  }

  close() {
    this.businessForm = this.initForm();
    this.goBack.emit(false);
  }


}
