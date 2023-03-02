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
  ) {
     this.isAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN');
    // verify if isAdmin is false
    if ( !this.isAdmin ) {
      // remove (ROLE_SUPER_ADMIN)
      this.roles = this.roles.filter((item: any) => item.ref !== 'ROLE_SUPER_ADMIN');
    }
  }

  ngOnInit(): void {
    if ( this.userForm ===  undefined ) {
      this.userForm = this.initForm();
    }
    this.getBusiness();

    // load test form
    // this.loadFormTest();
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
    // reset idRuta
    this.userForm.get('idRuta')?.reset();
    // disabled idRuta
    this.userForm.get('idRuta')?.disable();
    this.getRoutesByIdBusiness(idNegocio);
  };

  async getRoutesByIdBusiness(id: number = 0) {
    this.routes = [];
    let resp = await this.routeSvc.getRoutesByIdBusiness(id);
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200 ) {
        this.routes = data;
        this.userForm.get('idRuta')?.enable();
      }
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      return Object.values(this.userForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    // Validate passwords are the same
    if ( this.userForm.value.password !== this.userForm.value.confirm_password ) {
      this.alertSvc.showAlert(3, 'Error', 'Las contraseñas no son similares');
      return;
    }

    let resp = await this.userSvc.add(this.userForm.value, this.isAdmin, this.isEdit, this.existsLimit);
    let { status, comment } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', comment);
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(4, 'Error', comment);
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

    this.isEdit = true;
    this.userForm.patchValue({
      id: data?.id,
      nombre: data?.nombre,
      telefono: data?.telefono,
      email: data?.email,
      password: '123456',
      confirm_password: '123456',
      idNegocio: data?.negocioAndRuta?.idNegocio,
      // idRuta: data?.negocioAndRuta?.idRuta,
    });
    this.getRoutesByIdBusiness(data?.negocioAndRuta?.idNegocio);

    setTimeout(() => {
      // enable idRuta
      this.userForm.get('idRuta')?.enable();
      this.userForm.get('idRuta')?.patchValue(data?.negocioAndRuta?.idRuta);
    }, 300);
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['required'];
  }

  validRegex(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['pattern'];
  }

  validMinLength(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['minlength'];
  }

  validMaxLength(name: string) {
    return this.userForm.get(name)?.touched && this.userForm.get(name)?.errors?.['maxlength'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      email: ['', [Validators.pattern(this.regexEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      idNegocio: ['', Validators.required],
      idRuta: ['', Validators.required],
      role: ['', Validators.required],
      limit: [0],
    });
  }

  close() {
    this.goBack.emit(true);
  }

  /* Load form test */
  loadFormTest() {
    this.userForm.patchValue({
      nombre: 'Jorge Morales',
      telefono: '12345678',
      email: 'joge@gmail.com',
      password: '123456',
      confirm_password: '123456',
      limit: 1000,
    });
  }
}
