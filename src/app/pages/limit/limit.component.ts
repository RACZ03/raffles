import { Component, OnInit } from '@angular/core';
declare let window: any;

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
  public modalFreeNumberToSeller: any;
  public modalFreeNumberToRoute: any;
  public modalFreeNumberToBisness: any;
  public modalFreeLimitWitOutLimit: any;

  constructor() {   }

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
    this.modalFreeNumberToSeller = new window.bootstrap.Modal(
      document.getElementById('modalFreeNumberToSeller')
    );
    this.modalFreeNumberToRoute = new window.bootstrap.Modal(
      document.getElementById('modalFreeNumberToRoute')
    );

    this.modalFreeNumberToBisness = new window.bootstrap.Modal(
      document.getElementById('modalFreeNumberToBisness')
    );

    this.modalFreeLimitWitOutLimit = new window.bootstrap.Modal(
      document.getElementById('modalFreeLimitWitOutLimit')
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

  //free number to seller
  openModalFreeNumberToSeller(){
    this.modalFreeNumberToSeller.show();
  }

  closefreeNumberToSeller(band: boolean) {
    if ( band )
    this.modalFreeNumberToSeller.hide();
  }

  //free number to route
  openModalFreeNumberToRoute(){
    this.modalFreeNumberToRoute.show();
  }

  closefreeNumberToRoute(band: boolean) {
    if ( band )
    this.modalFreeNumberToRoute.hide();
  }

  //free number to bisness
  openModalFreeNumberToBisness(){
    this.modalFreeNumberToBisness.show();
  }

  closefreeNumberToBisness(band: boolean) {
    if ( band )
    this.modalFreeNumberToBisness.hide();
  }

  //modal cambiar limites sin afectar limitados
  openModalChangeLimitWithoutAffectLimited(){
    this.modalFreeLimitWitOutLimit.show();
  }

  closeModalChangeLimitWithoutAffectLimited(band: boolean) {
    if ( band )
    this.modalFreeLimitWitOutLimit.hide();
  }


}