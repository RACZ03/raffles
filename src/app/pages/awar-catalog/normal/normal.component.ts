
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';
import { AddAwarCatalogComponent } from '../add-awar-catalog/add-awar-catalog.component';
import { EditAwardCatalogComponent } from '../edit-award-catalog/edit-award-catalog.component';


@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.scss']
})
export class NormalComponent implements  OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public modalAddAwardNormal: any;
  public dataNormal: any[] = [];
  public data: any[] = [];
  public showFormAward: boolean = false;
  public search: string = '';



  constructor(
    private awardServ: awarCatalogService,
    private alertSvc: AlertService,
    private dataTableSvc: DataTableServiceService,
    public dialog: MatDialog,
    public exportSvc : ExporterDataService,
  ) {
    this.dtOptions = this.dataTableSvc.dtOptions || {};
    this.loadData();
  }



  openDialogNormal(): void {
    const dialogRef = this.dialog.open(AddAwarCatalogComponent);

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
    }

    editPremioNormal(premioNormal: any){
      const dialogRef = this.dialog.open(EditAwardCatalogComponent, {
        data: {premio: premioNormal}
      });
      dialogRef.afterClosed().subscribe(result => {
        window.location.reload();
      });
  
    }
  

  async elimiarPremioNormal(premioNormal: any){

      let confirm =  this.alertSvc.showConfirmLimit('Eliminar Premio','¿Estas seguro de eliminar este premio?', 'Eliminar',)
      if(await confirm){
     let resp = await this.awardServ.deleteAwardCatalog(premioNormal.id)
      let { status, comment } = resp;
      if(status == 200){
        this.alertSvc.showAlert(1,'Exito', comment);
        window.location.reload();
      }
       }else{
      this.alertSvc.showAlert(3,'Eliminacion cancelada', 'Premio no eliminado');
    }
    }


  async loadData(_band: boolean = false) {

      let resp = await this.awardServ.getAwardCatalog();
      this.dataNormal = [];
      this.data=[];
      if ( resp !== undefined ) {
        let { status, data } = resp;;
        if ( status && status == 200) {
          for (const item of data) {
            if(!item.especial){
              this.dataNormal.push(item);
            }
          }       
          this.data = this.dataNormal;

        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
    this.dtTrigger.next(this.dtOptions);
  }

  /* Search */
  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

  /* Section Render & Destoy */
  renderer() {
    this.dtElement = ( this.dtElement == undefined ) ? this.dataTableSvc.dtElements : this.dtElement;
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

    /* Export to Excel */
    getFilteredData(): Promise<any[]> {
      return new Promise((resolve, reject) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          const filteredData = dtInstance.rows({search:'applied'}).data().toArray().map((item: any) => {
            return {
              'monto': item[0],
              'premio': item[1],
            }
          });
          resolve(filteredData);
        });
      });
    }

   /* Export to Excel */
  async exportToExcelNormal() {
    let data : any = [];
    if(this.search === ''){
      data = this.data;
    }else{
      data= await this.getFilteredData();
    }
    let json = data.map((item: any) => {
      return {
        'Monto': item.monto,
        'Premio': item.premio,
      }
    });
 
    this.exportSvc.exportToExcel(json, 'cataglo de premios normal');
  }

   async exportToPDFNormal() {
    let data : any = [];
    if(this.search === ''){
      data = this.data;
    }else{
      data= await this.getFilteredData();
    }
     let json = data.map((item: any) => {
       return {
         'Monto': item.monto,
         'Premio': item.premio,
       }
     });
     this.exportSvc.exportPdf(json, 'catalogo de premios normal',2, false);
   
    
  }


}
