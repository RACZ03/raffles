import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/@core/services/report.service';

@Component({
  selector: 'app-detalle-vendedores',
  templateUrl: './detalle-vendedores.component.html',
  styleUrls: ['./detalle-vendedores.component.scss']
})
export class DetalleVendedoresComponent implements OnInit {
public data: any = [];
  constructor(
    private reportSvr: ReportService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
       this.reportSvr.getDetailSeller().then((res: any) => {
         this.data = res;
         console.log(this.data);
       });
  }

}
