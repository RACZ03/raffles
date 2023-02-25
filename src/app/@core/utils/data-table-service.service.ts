import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTableServiceService {

  public dtElements: any;

  public dtOptions: DataTables.Settings = {};

  constructor() {
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 5,
      scrollX: true,
      autoWidth: false,
      destroy: true,
      responsive: true,
      dom: 'rtip',
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
    }
  }
}
