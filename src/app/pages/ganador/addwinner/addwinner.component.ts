import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-addwinner',
  templateUrl: './addwinner.component.html',
  styleUrls: ['./addwinner.component.scss']
})
export class AddwinnerComponent implements OnInit {

  fechaSorteo = new FormControl('',[Validators.required, this.fechaValida]);
  numeroGanador = new FormControl('',[Validators.required,Validators.pattern('^[0-9]+'),this.numeroNegativo]);
  selected = new FormControl('',[Validators.required]);

  fechaValida(control: FormControl): { [s: string]: boolean } {
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    if (fechaIngresada > fechaActual) {
      return { fechaInvalida: true };
    }
    return {};
  }

  numeroNegativo(control: FormControl): { [s: string]: boolean } {
    const numeroIngresado = control.value;
    if (numeroIngresado < 0) {
      return { numeroNegativo: true };
    }
    return {};
  }

  ngbDatepicker: NgbDate | undefined;
  public model : NgbDate | undefined;
  public dataSorteo : any[] = [];

  winnwerForm!: FormGroup;
  @Output() goBack = new EventEmitter<boolean>();
  
  

  constructor(
    private fb: FormBuilder,
    private alertSvc: AlertService,
    private modalService: NgbModal, 
    private calendar: NgbCalendar,
    private winnerSvc: WinnerService
  ) { 
   
  }

  ngOnInit(): void {
    this.winnwerForm = this.fb.group({
      fechaSorteo: this.fechaSorteo,
      numeroGanador: this.numeroGanador,
      selected: this.selected
    });
    this.loadDataSorteo();
  }

 async loadDataSorteo(){
   this.dataSorteo = [];
   let resp = await this.winnerSvc.getSorteo();
    let { data,status,message,comment } = resp;
   if(status==200){
      this.dataSorteo = data;
    }else{
      this.alertSvc.showAlert(4,comment,message);
    } 
  }



async  onSubmit() {

    let resp1 = await this.winnerSvc.verifywinner(moment(this.fechaSorteo.value).format('YYYY-MM-DD'), this.selected.value );
    let { status,comment } = resp1;
    if(status==200){
      if (this.winnwerForm.valid) {
        let data = {
          fecha: moment(this.fechaSorteo.value).format('YYYY-MM-DD'),
          numeroGanador: this.numeroGanador.value,
          idSorteo: this.selected.value
        }
        let resp =  await this.winnerSvc.addWinner(data);
        let { status,comment,message } = resp;
        if(status==200){
          this.alertSvc.showAlert(1,message,comment);
          this.close();
        }else{
          this.alertSvc.showAlert(4,message,comment);
          this.close();
        }
      }
    }else
    {
      let confirm = await this.alertSvc.showConfirmLimit(comment,'Desea Guardar el numero ganador:'+this.numeroGanador.value+'?','Guardar');
      if(confirm){
        let data = {
          fecha: moment(this.fechaSorteo.value).format('YYYY-MM-DD'),
          numeroGanador: this.numeroGanador.value,
          idSorteo: this.selected.value
        }
        let resp =  await this.winnerSvc.addWinner(data);
        let { status,comment,message } = resp;
        if(status==200){
          this.alertSvc.showAlert(1,message,comment);
          this.close();
        }else{
          this.alertSvc.showAlert(4,message,comment);
          this.close();
        }
      }else{
        this.alertSvc.showAlert(3,'Cancelado','Usuario cancelo la operacion');
        this.close();
      }


    }
    
   
  }

  close() {
    this.goBack.emit(false);
  }
}
