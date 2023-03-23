import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { UploadImageService } from 'src/app/@core/services/upload-image.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {

  public isEdit: boolean = false;
  public isCancel: boolean = false;
  businessForm!: FormGroup;


  public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public logo: string = '';

  constructor(
    private fb: FormBuilder,
    private userSvc: UsersService,
    private businessSvc: BusinessService,
    private alertSvc: AlertService,
    public updloadSvc: UploadImageService
  ) {

  }

  ngOnInit(): void {
    let business = this.userSvc.getBusinessByAuth();
    if ( this.businessForm ===  undefined ) {
      this.businessForm = this.initForm();
    }

    if ( business !== null ) {
      this.getBusiness(business?.idNegocio);
    }
  }

  async getBusiness(id: number) {
    this.isEdit = true;
    let resp = await this.businessSvc.getById(id);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.loadForm(data);
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
      this.getBusiness(this.userSvc.getBusinessByAuth()?.idNegocio);
      // update business.logo in localstorage
      localStorage.getItem('business')?.replace(this.logo, 'logo');
      
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
    let logo = data?.logo;
    if ( logo !== null ) {
      if ( logo == '') return;

      // validate if logo include http or https
      if ( logo.includes('http') || logo.includes('https') ) {
        this.logo = logo;
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

}
