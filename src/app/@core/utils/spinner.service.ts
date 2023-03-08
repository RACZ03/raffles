import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {


  constructor(
    private spinner: NgxSpinnerService
  ) { }

  show() {
    this.spinner.show();
  }
  hide() {
    this.spinner.hide();
  }
}
