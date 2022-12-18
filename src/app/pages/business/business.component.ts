import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BusinessService } from 'src/app/@core/services/business.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public data: any[] = [];
  public showForm: boolean = false;

  constructor(
    private businessService: BusinessService,
    private alertSvc: AlertService
  ) { 
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 'Bfrtip',
      searching: true,
      search: false,
      info: false,
    };
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData() {
    let resp = await this.businessService.getBusiness();
    let { status, data } = resp;
    if ( status && status == 200) {
      this.data = data;
      // console.log(this.data)
    } else {
      this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
    }
    this.dtTrigger.next(this.dtOptions);
  }

  add() {
    this.showForm = true;
  }


  /* Search */
  searchData(e: any) {
    let value = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value).draw();
    });
  }

  /* Section Render & Destoy */
  renderer() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
  });
  }

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }

 
}
