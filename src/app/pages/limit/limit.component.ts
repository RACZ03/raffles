import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { LimitService } from 'src/app/@core/services/limit.service';
import { RouteService } from 'src/app/@core/services/route.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

declare var window: any;

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.scss']
})
export class LimitComponent implements OnInit {

  public modalChangelimitxruta: any;
  public modalChangelimitxvendedor: any;
  public modalChangeOneLimit: any;
  public modalChangeLimitoneVendedor: any;
 

  constructor(
    private limitServ: LimitService,
    private alertSvc: AlertService,
    private routeSvc: RouteService,

  ) { 
   
  }

  ngOnInit(): void {
    this.modalChangelimitxruta = new window.bootstrap.Modal(
      document.getElementById('modalchangelimitxruta')
    );
    this.modalChangelimitxvendedor = new window.bootstrap.Modal(
      document.getElementById('modalchangelimitxvendedor')
    );
    this.modalChangeOneLimit = new window.bootstrap.Modal(
      document.getElementById('modalChangeOneLimit')
    );
    this.modalChangeLimitoneVendedor = new window.bootstrap.Modal(
      document.getElementById('modalChangeLimitoneVendedor')
    );

  }

  /// Modal Change Limit x Ruta
  openModalchangelimitxruta(){
   this.modalChangelimitxruta.show();

  }
  closemodalchangelimitxruta(band: boolean) {
    if ( band )
      this.modalChangelimitxruta.hide();
  }

   /// Modal Change Limit x Vendedor
    openModalChangeLimitexVendedor(){
    this.modalChangelimitxvendedor.show();
  }

  closeModalChangeLimitexVendedor(band: boolean) {
    if ( band )
    this.modalChangelimitxvendedor.hide();
  }

  //modal change one limite
  openModalChangeOneLimit(){
    this.modalChangeOneLimit.show();
  }

  closeModalChangeOneLimit(band: boolean) {
    if ( band )
    this.modalChangeOneLimit.hide();
  }

  //model change limit de un vendedor
  openModalChangeLimitoneVendedor(){
    this.modalChangeLimitoneVendedor.show();
  }

  closeModalChangeLimitoneVendedor(band: boolean) {
    if ( band )
    this.modalChangeLimitoneVendedor.hide();
  }

}