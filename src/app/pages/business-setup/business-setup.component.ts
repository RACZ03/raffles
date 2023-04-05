import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/@core/services/auth.service';
import { BusinessService } from 'src/app/@core/services/business.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';

@Component({
  selector: 'app-business-setup',
  templateUrl: './business-setup.component.html',
  styleUrls: ['./business-setup.component.scss']
})
export class BusinessSetupComponent implements OnInit {


  public data: any[] = [];
  public dataBusiness: any[] = [];
  public search: string = '';
  public business: any = {};
  public isAdmin: boolean = false;
  public initLoad: boolean = false;

  constructor(
    private businessService: BusinessService,
    private alertSvc: AlertService,
    private dataTableSvc: DataTableServiceService,
    private exportSvc: ExporterDataService,
    private userSvc: UsersService,
  ) {
    // get admin
    this.isAdmin = userSvc.verifyRole('ROLE_SUPER_ADMIN', true) as boolean;

    if ( this.isAdmin ) {
      this.loadDataBusiness();
    } else {
      // get business from localstorage
      let business = localStorage.getItem('business');
      if ( business !== null ) {
        this.business = JSON.parse(business);
        this.loadData(this.business.idNegocio);
      }
    }
  }

  ngOnInit(): void {

  }

  async changeStatus(item: any) {
    // show alert verify status
    let message = item?.limitado ? '¿Está seguro de cambiar el estado a no limitado?' : '¿Está seguro de cambiar el estado a limitado?';
    let res = await this.alertSvc.showConfirmLimit( message, '', 'Si');
    if ( res ) {
      let resp = await this.businessService.changeStatus(item.idSorteo, item.idNegocio);
      if ( resp !== undefined ) {
        let { status, data } = resp;
        if ( status && status == 200) {
          this.alertSvc.showAlert(1, 'Info', 'Se ha cambiado el estado');
          this.onSelectedBusiness( item.idNegocio );
        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cambiar el estado');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cambiar el estado');
      }
    }

  }

  async loadDataBusiness() {
    let resp = await this.businessService.getBusiness();
    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status && status == 200) {
        this.dataBusiness = data;
        // console.log(this.data)
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
    } else {
      this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
    }
  }

  onSelectedBusiness(e: any) {
    this.data = [];

    this.business = e;
    this.loadData(e);
  }


  async loadData(id: number) {
    this.data = [];

    this.initLoad = true;
    if ( id === undefined ) {
    } else {
      let resp = await this.businessService.getSorteosByBusiness(id);
      if ( resp !== undefined ) {
        let { status, data } = resp;
        if ( status && status == 200) {
          this.data = data;
          // console.log(this.data)
        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
    }
  }

  async onUpdateDay() {
    let day = document.getElementById('inputDay') as HTMLInputElement;
    // validate day is not empty, not null and not undefined
    if ( day === undefined || day === null || day.value === '') {
      this.alertSvc.showAlert(3, 'Info', 'Debe ingresar el día a actualizar');
      return;
    }

    // show alert comfirm update day
    let res = await this.alertSvc.showConfirmLimit( '¿Está seguro de actualizar el día de lotería?', '', 'Si');
    if ( res ) {

      let resp = await this.businessService.updateDay(day.value as string);
      if ( resp !== undefined ) {
        let { status, comment } = resp;
        if ( status && status == 200) {
          this.alertSvc.showAlert(1, 'Success', comment);
        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo actualizar el día');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo actualizar el día');
      }
      // clear input
      day.value = '';
    }
  }


  async exportToExcel() {
    let data: any = [];
    if ( this.search === '' ) {
      data = this.data;
    }

    let json = data.map((item: any) => {
      return {
        'Nombre': item?.sorteo?.nombre,
        'Hora Inicio': item?.sorteo?.horaInicio,
        'Hora Fin': item?.sorteo?.horaFin,
        'Estado': item?.limitado ? 'Limitado' : 'No Limitado',
      }
    });
    this.exportSvc.exportToExcel(json, 'ConfiguracionNegocios');
  }

  async exportToPDF() {
    let data: any = [];
    if ( this.search === '' ) {
      data = this.data;
    }

    let json = data.map((item: any) => {
      return {
        'Nombre': item?.sorteo?.nombre,
        'Hora Inicio': item?.sorteo?.horaInicio,
        'Hora Fin': item?.sorteo?.horaFin,
        'Estado': item?.limitado ? 'Limitado' : 'No Limitado',
      }
    });

    this.exportSvc.exportPdf(json, 'ConfiguracionNegocios', 4, false);
  }
}
