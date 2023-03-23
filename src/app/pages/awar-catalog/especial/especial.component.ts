import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { awarCatalogService } from 'src/app/@core/services/awarCatalog.service';
import { AlertService } from 'src/app/@core/utils/alert.service';
import { DataTableServiceService } from 'src/app/@core/utils/data-table-service.service';
import { ExporterDataService } from 'src/app/@core/utils/exporter-data.service';
import { AddAwwardEspecialComponent } from '../add-awward-especial/add-awward-especial.component';
import { EditAwardCatalogComponent } from '../edit-award-catalog/edit-award-catalog.component';

@Component({
  selector: 'app-especial',
  templateUrl: './especial.component.html',
  styleUrls: ['./especial.component.scss']
})
export class EspecialComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public dataEspecial: any[] = [];


  public dataA: any[] = [];
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

  ngOnInit(): void {
   
  }

  openDialogEspecial(): void {
    const dialogRef = this.dialog.open(AddAwwardEspecialComponent); 
  
    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();});
    }

    editPremioEspecial(premioEspecial: any){
      const dialogRef = this.dialog.open(EditAwardCatalogComponent, {
        data: {premio: premioEspecial}
      });
      dialogRef.afterClosed().subscribe(result => {
        window.location.reload();}
        );
    }

  async elimiarPremioEspecial(premioEspecial: any){

    let confirm =  this.alertSvc.showConfirmLimit('Eliminar Premio','¿Estas seguro de eliminar este premio?', 'Eliminar',)
    if(await confirm){   
   let resp = await this.awardServ.deleteAwardCatalog(premioEspecial.id)
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
      this.dataEspecial = [];
      this.dataA=[];
      if ( resp !== undefined ) {
        let { status, data } = resp;
        if ( status && status == 200) {
          for (const item of data) {
            if(item.especial){
              this.dataEspecial.push(item);
            }
          }
          this.dataA = this.dataEspecial;

        } else {
          this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
        }
      } else {
        this.alertSvc.showAlert(3, 'Info', 'No se pudo cargar los datos');
      }
      this.dtTrigger.next(this.dtOptions);
  }

  searchData(e: any) {
    this.search = e.target.value;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.search(this.search).draw();
    });
  }

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
  async exportToExcelEspacial() {
    let data : any = [];
    if(this.search === ''){
      data = this.dataA;
    }else{
      data= await this.getFilteredData();
    }
    let json = data.map((item: any) => {
      return {
        'Monto': item.monto,
        'Premio': item.premio
      }
    });
    this.exportSvc.exportToExcel(json, 'catalogo de premios especiales');
  }


 async exportToPDFEspecial() {
    let data : any = [];
    if(this.search === ''){
      data = this.dataA;
    }else{
      data= await this.getFilteredData();
    }

    let json = data.map((item: any) => {
      return {
        'Monto': item.monto,
        'Premio': item.premio,
      }
    });
    this.exportSvc.exportPdf(json, 'Catalogo de premios especiales',2,false);
  }


}
