import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastrSvc: ToastrService
  ) { }

  /*
  * @param {string} message
  * @param {string} title
  * @param {string} type (1: success, 2: warning, 3: info, 4: error)
  * */
  
  showAlert(type: number, title: string, message: string) {
    switch (type) {
      case 1: this.toastrSvc.success(message, title); break;
      case 2: this.toastrSvc.warning(message, title); break;
      case 3: this.toastrSvc.info(message, title); break;
      default:
        this.toastrSvc.error(message, title);
        break;
    }
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: message,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  showConfirmLimit(title: string, message: string, butonconfirm: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: message,
        // icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: butonconfirm,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
