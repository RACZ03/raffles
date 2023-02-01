import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LimitService } from 'src/app/@core/services/limit.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.scss']
})
export class LimitComponent implements OnInit {

  public scrollOptions: any[] = [
    { title: 'Cambio limite de numeros por ruta', active: true },
    { title: 'Cambio Limite de numeros por vendedor', active: false },
    { title: 'Cambiar un limite', active: false },
    { title: 'Cambiar limite a un vendedor', active: false },
    { title: 'Cambiar limite sin afectar limitados ', active: false },
    { title: 'Liberar numero a vendedores', active: false },
    { title: 'Liberar numeros a rutas', active: false },
    { title: 'Liberar numero al negocio', active: false },
  ];
  public optionSelected: number = 0;

  constructor(
    private limitServ: LimitService,
    private alertSvc: AlertService,
  ) { 
  
  }

  ngOnInit(): void {
   
  }

  changeOptions(e: any, index: number) {
    for (let i = 0; i < this.scrollOptions.length; i++) {
      this.scrollOptions[i].active = false;

      if ( i == index )
        this.scrollOptions[i].active = true;
        
    }
    this.optionSelected = index;
  }
  

}