import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-awar-catalog',
  templateUrl: './awar-catalog.component.html',
  styleUrls: ['./awar-catalog.component.scss']
})
export class AwarCatalogComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  flag = 'normal';
  public dataNormal: any[] = [];
  public dataEspecial: any[] = [];

  public dataA: any[] = [];
  public showFormAward: boolean = false;
  public awardSelected: any = null;


  constructor(
    private awardServ: awarCatalogService,
    private alertSvc: AlertService,
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
      language: {
        paginate: {
          first: "Primero",
          last: "Último",
          previous: "<",
          next: ">",
        }
      }
    };
    this.loadData();

  }

  ngOnInit(): void {
  }

  async loadData() {
    let resp = await this.awardServ.getAwardCatalog();
    console.log(resp)
    this.dataNormal = [];
    this.dataEspecial = [];
    this.dataA=[];
    let { status, data } = resp;
    if ( status && status == 200) {
     for (let i = 0; i < data.length; i++) {
        if(data[i].especial == false){
          this.dataNormal.push(data[i]);
        }else{
          this.dataEspecial.push(data[i]);
        }
      }
      console.log(this.dataNormal)
      this.dataA = this.dataNormal;
      if(this.flag == 'especial'){
       this.flag = 'normal';
      }
      
    } else {
      this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
    }
    if ( this.dtElement != undefined ) {
      this.renderer();
    }
    this.dtTrigger.next(this.dtOptions);
  }

 async changeFlag(){
    if(this.flag == 'normal'){
      this.flag = 'especial';
      this.dataA=[];
      if ( this.dtElement != undefined ) {
        this.renderer();
      }
      setTimeout(() => {
        this.dataA = this.dataEspecial;
        this.dtTrigger.next(this.dtOptions);
      }, 100);     
    }
  
 }

  // Actions
  addAward() {
    this.showFormAward = true;
  }

  onEditAward(item: any) {
    this.awardSelected = item;
    this.showFormAward = true;
  }

  closeAward(e: boolean) {
    if ( !e ) {
      this.showFormAward = false;
      return;
    }
    this.showFormAward = false;
    if ( this.dtElement != undefined ) {
      this.renderer();
    }
    this.loadData();
  }

  async onDeleteAward(item: any) {
    let resp = await this.alertSvc.showConfirm('Eliminar', '¿Está seguro de eliminar el registro?');
    if (resp) {
      let resp = await this.awardServ.delete(item.id);
      let { status } = resp;
      if ( status && status == 200) {
        this.alertSvc.showAlert(1, '', 'Registro eliminado');
        this.renderer();
        this.loadData();
      } else {
        this.alertSvc.showAlert(4, '', 'No se pudo eliminar el registro');
      }
    }
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
 this.dtElement.dtInstance?.then((dtInstance: DataTables.Api) => {
   dtInstance.destroy();
  });
}

  /* Destroy components */
  ngOnDestroy(): void {
    // this.renderer
    this.dtTrigger.unsubscribe();
  }


}
