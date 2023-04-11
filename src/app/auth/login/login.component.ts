import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private langs: string[] = [];
  private lang: string = 'es';
  public loginForm!: FormGroup;
  // public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private alertSvc: AlertService,
    private router: Router
  ) {
    translate.setDefaultLang('es');
    translate.use('es')
    translate.addLangs(['en', 'es']);
    this.langs = this.translate.getLangs();
  }

  changeLang(e: any) {
    let status = e?.target?.checked;
    this.lang = (!status) ? 'en' : 'es';
    this.translate.use(this.lang);
  }

  ngOnInit(): void {
    this.loginForm = this.initForm();
    let user = localStorage.getItem('remeberUser');
    if (user) {
      this.loginForm.get('email')?.setValue(user);
      // check by id customCheckLogin
      document.getElementById('customCheckLogin')?.setAttribute('checked', 'true');
    } else {
      document.getElementById('customCheckLogin')?.removeAttribute('checked');
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
        ],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, Validators.minLength(4) ]],
    });
  }

  async onSubmit() {
    // login by password
    let resp = await this.authSvc.login(this.loginForm.value);
    let { error, comment, message } = resp;

    if ( error ) {
      //let message = (this.lang === 'es') ? 'Credenciales Invalidas' : 'Invalid credentials';
      this.alertSvc.showAlert(3, '', error?.message ? error?.message : comment);
      return;
    }

    let roles = resp?.roles;
    let business = resp?.negocioAndRuta;
    localStorage.setItem('identity', JSON.stringify(resp));
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('business', JSON.stringify(business));

    let message2 = (this.lang === 'es') ? `Bienvenido ${ resp?.nombre }!` : `Welcome ${ resp.nombre }!`;
    // console.log(message)
    this.alertSvc.showAlert(1, '', message2);
    this.router.navigate(['/pages/dashboard']);
  }

  rememberUser(e: any) {
    let checket = e?.target?.checked;
    if (checket) {
      localStorage.setItem('remeberUser', (this.loginForm.get('email')?.value || ''));
    } else {
      localStorage.removeItem('remeberUser');
    }
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.errors?.['required'];
  }

  validInputMin(name: string) {
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.errors?.['minlength'];
  }

  validEmail(name: string) {
    return this.loginForm.get(name)?.touched && this.loginForm.get(name)?.errors?.['pattern'];
  }

}
