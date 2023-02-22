import { Component, OnInit, ViewChild } from '@angular/core';
import { LimitService } from 'src/app/@core/services/limit.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

declare var window: any;

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.scss']
})
export class LimitComponent implements OnInit {

  public modalChangelimitxruta: any;

  constructor(
    private limitServ: LimitService,
    private alertSvc: AlertService,
  ) { 
  
  }

  ngOnInit(): void {
    this.modalChangelimitxruta = new window.bootstrap.Modal(
      document.getElementById('modalchangelimitxruta')
    );
  }

  openModalchangelimitxruta(){
   this.modalChangelimitxruta.show();
   console.log('aqui ando');
  }
  
  closeModal(band: boolean) {
    if ( band )
      this.modalChangelimitxruta.hide();

  }


}