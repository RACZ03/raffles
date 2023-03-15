import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { WinnerService } from 'src/app/@core/services/winner.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';

@Component({
  selector: 'app-list-ganador',
  templateUrl: './list-ganador.component.html',
  styleUrls: ['./list-ganador.component.scss']
})
export class ListGanadorComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public showFormAddWinner: boolean = false;

  public data: any[] = [];

  constructor(
    private dataTableSvc: DataTableServiceService,
    private winnerSvc: WinnerService
  ) { 
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    this.data = [];
    let resp = await this.winnerSvc.getwinners();
     let { data,status,message,comment } = resp;
     console.log(data);
     if(status==200){
        this.data = data;
      }


    this.dtTrigger.next(this.dtOptions);
  }

  addWinner() {
    this.dataTableSvc.dtElements = this.dtElement;
    this.showFormAddWinner = true;
  }

   close(e: boolean) {
    this.showFormAddWinner = false;
    this.renderer();
  }
  /* Section Render & Destoy */
  renderer() {
    this.dtElement = this.dataTableSvc.dtElements;
    // unsubscribe the event
    this.dtTrigger.unsubscribe();
    // destroy the table
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // new observable
      this.dtTrigger = new Subject();
      this.loadData();
    });
  }

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }

}
