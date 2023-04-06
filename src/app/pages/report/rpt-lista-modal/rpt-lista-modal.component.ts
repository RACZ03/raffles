import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/@core/services/report.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

@Component({
  selector: 'app-rpt-lista-modal',
  templateUrl: './rpt-lista-modal.component.html',
  styleUrls: ['./rpt-lista-modal.component.scss']
})
export class RptListaModalComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public search: string = '';
  public data: any = [];

  constructor(
    public dialogRef: MatDialogRef<RptListaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    public reporSvr: ReportService,
    private dataTableSvc: DataTableServiceService,
    private alerSvr : AlertService
  ) {

    this.loadData(item);
  }

  ngOnInit(): void {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
  }

 async  loadData(_data: any) {
  console.log(_data);
    let resp = await this.reporSvr.getRPTLista(_data.fecha,_data.idsorteo,_data.idvendedor)
    let {data_, status} = resp;
    if(status == 200){
      this.data = data_;
    }else{
      //this.data = [];
      this.alerSvr.showAlert(1, 'Error', 'No se encontraron datos');
    }
    this.dtTrigger.next(this.dtOptions);
    console.log(resp);

  }

  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

}
