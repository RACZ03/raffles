import { BusinessService } from 'src/app/@core/services/business.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/@core/services/auth.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-route',
  templateUrl: './add-route.component.html',
  styleUrls: ['./add-route.component.scss']
})
export class AddRouteComponent implements OnInit {
  public isEdit: boolean = false;
  routeForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();

  public businessSelected: any = null;
  public isAdmin: boolean = false;

  public business: any[] = [];

  @Input() set route(value: any) {
    // console.log(value);
    if (value != null) {
      this.routeForm = this.initForm();
      this.loadForm(value);
    }
  }

  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,
    private alertSvc: AlertService,
    private userSvc: UsersService,
    private businessSvc: BusinessService
  ) {
    this.isAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN') as boolean;
  }

  ngOnInit(): void {
    if ( this.routeForm ===  undefined ) {
      this.routeForm = this.initForm();
    }
    // console.log('is');

    if ( this.isAdmin ) {
      this.getBusiness();
    }
  }

  async getBusiness() {
    let resp = await this.businessSvc.getBusiness();
    let { status, data } = resp;
    if ( status && status == 200) {
      this.business = data;
    }
  }


  async onSubmit() {
    if (this.routeForm.invalid) {
      return Object.values(this.routeForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    if ( this.isAdmin ) {
      // validate route empty
      let { idNegocio } = this.routeForm.value;
      if ( idNegocio === 0 ) {
        this.alertSvc.showAlert(4, 'Error', 'Seleccione un negocio');
        return;
      }
    }

    let resp = await this.routeSvc.add(this.routeForm.value, this.isEdit);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', 'Registro guardado');
      // resete formulario
      this.routeForm = this.initForm();
      this.isEdit = false;
      this.goBack.emit(true);
    } else {
      this.alertSvc.showAlert(4, 'Error', 'No se pudo guardar el registro');
    }

  }

  loadForm(data: any) {
    if ( this.routeForm ===  undefined ) {
      return;
    }

    this.routeForm.patchValue({
      id: data?.id,
      nombre: data?.nombre,
      descripcion: data?.descripcion,
      idNegocio: data?.idNegocio
    });
    this.isEdit = true;
  }

  /* SECTION VALIDATIONS */
  validInput(name: string) {
    return this.routeForm.get(name)?.touched && this.routeForm.get(name)?.errors?.['required'];
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [],
      idNegocio: [0],
    });
  }

  close() {
    this.goBack.emit(true);
  }


}
