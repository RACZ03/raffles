import { rolesList } from './../../../@core/data/roles';
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

  public isAdmin: boolean|string = false;
  public existsLimit: boolean = false;
  public roles: any[] = rolesList;
  public businesses: any[] = [];
  public routes: any[] = [];

  public inputType: string = 'password';
  public inputType2: string = 'password';
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  public regexEmail = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  
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
    this.isAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
  }

  async getBusiness() {
    let resp = await this.businessSvc.getBusiness();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200 ) {
        this.businesses = data;
      }
    }
    // disabled idRuta
    this.userForm.get('idRuta')?.disable();
  }

  onSelectBusiness() {
    let { idNegocio } = this.userForm.value;
    this.getRoutesByIdBusiness(idNegocio);
  };

  async getRoutesByIdBusiness(id: number = 0) {
    let resp = await this.routeSvc.getRoutesByIdBusiness(id);
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200 ) {
        this.routes = data;
        // enabled idRuta
      }
    }
    this.userForm.get('idRuta')?.enable();
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      return Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.userSvc.add(this.userForm.value, this.isAdmin, this.isEdit, this.existsLimit);
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

  onChangeRole() {
    let role = this.userForm.get('role')?.value;
    if (role == 'ROLE_VENDEDOR') {
      this.existsLimit = true;
    } else {
      this.existsLimit = false;
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
      email: data?.email,
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

  validRegex(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['pattern'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.pattern(this.regexEmail)]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      idNegocio: ['', Validators.required],
      idRuta: ['', Validators.required],
      role: ['', Validators.required],
      limit: [0],
    });
  }

  close() {
    this.goBack.emit(true);
  }

}
