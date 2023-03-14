
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
  public dataA: any[] = [];
  public showFormAward: boolean = false;



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
      this.dataA=[];
      if ( resp !== undefined ) {
        let { status, data } = resp;;
        if ( status && status == 200) {
          for (const item of data) {
            if(!item.especial){
              this.dataNormal.push(item);
            }
          }
         
          this.dataA = this.dataNormal;
          console.log(this.dataA);

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
    if ( !this.dtElement ) return;

    let value = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(value).draw();
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
   exportToExcelNormal() {
    let json = this.dataA.map((item: any) => {
      return {
        'Monto': item.monto,
        'Premio': item.premio,
        'Especial': item.especial ? 'Si' : 'No',
      }
    });
 
    this.exportSvc.exportToExcel(json, 'cataglo de premios');
  }

  exportToPDFNormal() {
    let json = this.dataA.map((item: any) => {
      return {
        'Monto': item.monto,
        'Premio': item.premio,
        'Especial': item.especial ? 'Si' : 'No',
      }
    });
    this.exportSvc.exportPdf(json, 'catalogo de premios');
  }


}
