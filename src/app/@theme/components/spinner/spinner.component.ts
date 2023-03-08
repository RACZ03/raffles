import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/@core/utils/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `<ngx-spinner class=""
           bdColor="rgba(51,51,51,0.8)"
          size="medium"
          color="#fff"
          type="ball-scale-multiple"
            ><p style="color: white"></p></ngx-spinner
          >`,
})
export class SpinnerComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
