import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/@core/services/business.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent implements OnInit {

  businessForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private businessSvc: BusinessService,
    alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
    this.businessForm = this.initForm();
  }

  async onSubmit() {
    if (this.businessForm.invalid) {
      return Object.values(this.businessForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    let resp = await this.businessSvc.add(this.businessForm.value);
    console.log(resp);
  }

  // Validations
  inputValidated(inputName: string): boolean {
    return this.businessForm.get(inputName)?.invalid && this.businessForm.get(inputName)?.touched ? true : false;
  }

  // Form
  initForm(): FormGroup {
    return this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
    });
  }


}
