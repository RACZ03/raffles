import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-detalle-especial',
  templateUrl: './modal-detalle-especial.component.html',
  styleUrls: ['./modal-detalle-especial.component.scss']
})
export class ModalDetalleEspecialComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public data: any = [];
  public search: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalDetalleEspecialComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
  ) {
    this.loadData(item);
   }

  ngOnInit(): void {}


  loadData(_data:any){
    this.data = _data;
    this.dtTrigger.next(this.dtOptions);
  }

  closeModal(){
    this.dialogRef.close();
  }

      /* Search */
      searchData(e: any) {
        this.search = e.target.value;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.search(this.search).draw();
        });
      }


}
