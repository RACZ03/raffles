import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Input() set route(value: any) {
    console.log(value);
    if (value != null) {
      this.routeForm = this.initForm();
      this.loadForm(value);
    }
  }

 // public emailRegex: string ='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    if ( this.routeForm ===  undefined ) {
      this.routeForm = this.initForm();
    }
  }

  
  async onSubmit() {
    if (this.routeForm.invalid) {
      return Object.values(this.routeForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.routeSvc.add(this.routeForm.value, this.isEdit);
    let { status, data } = resp;
    if ( status && status == 200) {
      this.alertSvc.showAlert(1, 'Exito', 'Registro guardado');
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
    });
  }

  close() {
    this.goBack.emit(true);
  }


}
