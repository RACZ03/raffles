import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/@core/services/home.service';
import { UsersService } from 'src/app/@core/services/users.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart!: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  public isSuperAdmin: boolean = false;
  public isAdmin: boolean = false;
  public isSupervisor: boolean = false;

  public totalSuperAdmin: number = 0;
  public totalAdmin: number = 0;
  public totalSupervisores: number = 0;
  public totalVendedores: number = 0;

  public chartLabels: any[] = [];
  public ventasTotalesData: any[] = [];
  public premioTotalData: any[] = [];
  public utilidadData: any[] = [];

  constructor(
    private userSvc: UsersService,
    private homeSvc: HomeService
  ) {
    this.isSuperAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN') as boolean;
    this.isAdmin = this.userSvc.verifyRole('ROLE_ADMIN') as boolean;
    this.isSupervisor = this.userSvc.verifyRole('ROLE_SUPERVISOR') as boolean;
  }

  ngOnInit() {
    this.getDataTotalUsers();
    this.getSales();
  }

  async getDataTotalUsers() {
    let resp = await this.homeSvc.getCountUsers();
    if (resp ) {
      let { status, data } = resp;
      if (status == 200 ) {
        for (const item of data) {
          if ( item.nombre === 'ROLE_SUPER_ADMIN' )
            this.totalSuperAdmin = item.cantidad;
          else if ( item.nombre === 'ROLE_ADMIN' )
            this.totalAdmin = item.cantidad;
          else if ( item.nombre === 'ROLE_SUPERVISOR' )
            this.totalSupervisores = item.cantidad;
          else if ( item.nombre === 'ROLE_VENDEDOR' )
            this.totalVendedores = item.cantidad;
        }
      }
    }
  }


  async getSales() {
    let resp = await this.homeSvc.getGraficoVentas(10);
    if (resp ) {
      let { status, data } = resp;
      if (status == 200 ) {
        console.log(data);
        this.chartLabels = data.map((d: any) => d.fecha);
        this.ventasTotalesData = data.map((d: any) => d.ventas_totales);
        this.premioTotalData = data.map((d: any) => d.premio_total);
        this.utilidadData = data.map((d: any) => d.utilidad);
        this.createGraph();
      }
    }
  }

  createGraph() {

    let options = {
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
          display: true,
          tickets: {
            // mostrar las etiquetas en diagonal
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        }],
        yAxes: [{
          display: true
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    };

    const lineChart = new Chart('lineSales', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Ventas Totales',
            data: this.ventasTotalesData,
            borderColor: '#3cba9f',
            fill: false
          },
          {
            label: 'Premio Total',
            data: this.premioTotalData,
            borderColor: '#172b4d',
            fill: false
          },
        ]
      },
      options
    });

    const lineChart2 = new Chart('lineUtilities', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Utilidad',
            data: this.utilidadData,
            borderColor: '#e84a3c',
            fill: false
          }
        ]
      },
      options
    });
  }

}

