import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public user: any = null;

  @Input() set setUser(value: any) {
    if (value != null) {
      this.user = value;
    }
  }
  @Output() goBack = new EventEmitter<boolean>();

  public inputType: string = 'password';
  public inputType2: string = 'password';
  public showPassword: boolean = false;
  public showPassword2: boolean = false;

  public formChangePassword!: FormGroup

  constructor(
    private fb: FormBuilder,
    private userSvc: UsersService,
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    this.formChangePassword = this.initForm();
    console.log('change-pass');
  }

  async onSave() {
    if (this.formChangePassword.valid) {
      // mark all fields as touched
      Object.keys(this.formChangePassword.controls).forEach(field => {
        const control = this.formChangePassword.get(field);
        control?.markAsTouched({ onlySelf: true });
      } );
    }

    // Validate passwords are the same
    if ( this.formChangePassword.value.password !== this.formChangePassword.value.confirm_password ) {
      this.alertSvc.showAlert(3, 'Advertencia', 'Las contraseñas no son similares');
      return;
    }

    let resp = await this.userSvc.changePassword(this.user.id, this.formChangePassword.value);
    if ( resp != undefined ) {
      let { status, comment } = resp;
      if ( status == 200 ) {
        this.alertSvc.showAlert(1, 'Success', comment);
      } else {
        this.alertSvc.showAlert(3, 'Error', comment);
      }
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(3, 'Error', 'Error al cambiar la contraseña');
      this.goBack.emit(false);
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

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.formChangePassword.get(name)?.touched && this.formChangePassword.get(name)?.errors?.['required'];
  }
  validMinLength(name: string) {
    return this.formChangePassword.get(name)?.touched && this.formChangePassword.get(name)?.errors?.['minlength'];
  }

  initForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  close() {
    this.goBack.emit(false);
  }

}
