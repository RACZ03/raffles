import { Component, OnInit } from '@angular/core';
import { PrintService } from 'src/app/@core/utils/print.service';

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

  constructor(
    private printSvc: PrintService,
  ) { }

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

  //   var ordersChart = new Chart(chartOrders, {
  //     type: 'bar',
  //     options: chartExample2.options,
  //     data: chartExample2.data
  //   });

  //   var chartSales = document.getElementById('chart-sales');

  //   this.salesChart = new Chart(chartSales, {
	// 		type: 'line',
	// 		options: chartExample1.options,
	// 		data: chartExample1.data
	// 	});
  }

  print() {
    this.printSvc.printTicket('QJ4ERM36');
  }

  // public updateOptions() {
  //   this.salesChart.data.datasets[0].data = this.data;
  //   this.salesChart.update();
  // }

}

