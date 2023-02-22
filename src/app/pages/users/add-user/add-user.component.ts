import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  public isEdit: boolean = false;
  userForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();

  public businesses: any[] = [];
  public routes: any[] = [];

  public inputType: string = 'password';
  public inputType2: string = 'password';
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  
  public businessSelected: any = null;
  @Input() set user(value: any) {
    console.log(value);
    if (value != null) {
      this.userForm = this.initForm();
      this.loadForm(value);
    }
  }

  constructor(
    private fb: FormBuilder,
    private userSvc: UsersService,
    private alertSvc: AlertService,
    private businessSvc: BusinessService,
    private routeSvc: RouteService
  ) { }

  ngOnInit(): void {
    if ( this.userForm ===  undefined ) {
      this.userForm = this.initForm();
    }
    this.getBusiness();
    this.getRoutes();
  }

  async getBusiness() {
    let resp = await this.businessSvc.getBusiness();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200 ) {
        this.businesses = data;
      }
    }
  }

  async getRoutes() {
    let resp = await this.routeSvc.getRoute();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200 ) {
        this.routes = data;
      }
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      return Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.userSvc.add(this.userForm.value, this.isEdit);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', 'Registro guardado');
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(4, 'Error', 'No se pudo guardar el registro');
    }

  }

  onShowPassword(band: boolean = false) {
    if (band) {
      if (this.showPassword) {
        this.inputType = 'password';
        this.showPassword = false;
      } else {
        this.inputType = 'text';
        this.showPassword = true;
      }
    } else {
      if (this.showPassword2) {
        this.inputType2 = 'password';
        this.showPassword2 = false;
      } else {
        this.inputType2 = 'text';
        this.showPassword2 = true;
      }
    }
  }

  loadForm(data: any) {
    if ( this.userForm ===  undefined ) {
      return;
    }

    this.userForm.patchValue({
      id: data?.id,
      nombre: data?.nombre,
      telefono: data?.telefono,
      password: data?.password,
      confirm_password: data?.password,
      idNegocio: data?.idNegocio,
      idRuta: data?.idRuta,
    });
    this.isEdit = true;
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['required'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      idNegocio: ['', Validators.required],
      idRuta: ['', Validators.required],
    });
  }

  close() {
    this.goBack.emit(true);
  }

}
