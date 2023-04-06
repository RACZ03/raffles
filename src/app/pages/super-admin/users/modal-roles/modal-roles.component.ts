import { rolesList } from 'src/app/@core/data/roles';
import { RoleI } from './../../../../@core/interfaces/Role';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-modal-roles',
  templateUrl: './modal-roles.component.html',
  styleUrls: ['./modal-roles.component.scss']
})
export class ModalRolesComponent implements OnInit {

  public user: any = null;
  public isAdmin: boolean = false;

  @Input() set setUser(value: any) {
    if (value != null) {
      this.user = value;
      this.markOptions();
    }
  }
  @Output() goBack = new EventEmitter<boolean>();

  public roles: any[] = [];

  constructor(
    private alertSvc: AlertService,
    private userSvc: UsersService,
  ) {
    this.isAdmin = this.userSvc.verifyRole('ROLE_SUPER_ADMIN') as boolean;

    // if is admin, show all roles
    if (this.isAdmin) {
      // hubicar SUPER_ADMIN de first positions
      let superAdmin: any = rolesList.find(role => role.ref == 'ROLE_SUPER_ADMIN');
      rolesList.splice(rolesList.indexOf(superAdmin), 1);
      rolesList.unshift(superAdmin);

      this.roles = rolesList;
    } else {
      // if is not admin, show only roles that are not admin
      this.roles = rolesList.filter(role => role.ref != 'ROLE_SUPER_ADMIN');
    }
  }

  ngOnInit(): void {
  }

  markOptions() {
    this.roles.forEach(role => {
      let find = this.user?.roles.find((r: any) => r.nombre == role.ref);
      role.checket = find ? true : false;
    });
  }

  async submit(item: any, i: number) {
    // console.log(item, i);
    // get item checket by position i
    let checket = document.getElementById(`itemCheck${ i }`) as HTMLInputElement;
    if ( checket.checked ) {
      let title = 'Agregar rol';
      let message = `¿Está seguro de agregar el rol "${ item.nombre }?"`;
      let btn = 'Agregar';
      let resp = await this.alertSvc.showConfirmLimit(title, message, btn);
      if ( resp ) {
        let role = this.roles.find((r: any) => r.ref == item.ref);
        let res = await this.userSvc.addOrRole(this.user.telefono, item.code);
        if ( res ) {
          this.alertSvc.showAlert(1,'Rol agregado', 'El rol se agregó correctamente')
        } else {
          this.alertSvc.showAlert(2,'Error', 'El rol no se agregó correctamente')
        }
      }
    } else {
      let title = 'Eliminar rol';
      let message = `¿Está seguro de eliminar el rol "${ item.nombre }"?`;
      let btn = 'Eliminar';
      let resp = await this.alertSvc.showConfirmLimit(title, message, btn);
      if ( resp ) {
        let res = await this.userSvc.addOrRole(this.user.telefono, item.code, false);
        if ( res ) {
          this.alertSvc.showAlert(1,'Rol eliminado', 'El rol se eliminó correctamente')
        } else {
          this.alertSvc.showAlert(2,'Error', 'El rol no se eliminó correctamente')
        }
      }
    }

    this.goBack.emit(true);
  }

  close() {
    this.goBack.emit(false);
  }

}
