import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/@core/services/users.service';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-limit-history',
  templateUrl: './limit-history.component.html',
  styleUrls: ['./limit-history.component.scss']
})
export class LimitHistoryComponent implements OnInit {

  public user: any = null;
  public list: any[] = [];
  @Input() set setUser(value: any) {
    if (value != null) {
      this.user = value;
      this.getLimitHistory();
    }
  }
  @Output() goBack = new EventEmitter<boolean>();

  constructor(
    private usersSvc: UsersService,
    private alertSvc: AlertService
  ) { }

  ngOnInit(): void {
  }

  async getLimitHistory(): Promise<any> {
    let resp = await this.usersSvc.getLimitsBySeller(this.user.id);

    if ( resp !== undefined ) {
      let { status, data } = resp;
      if ( status == 200 ) {
        this.list = data;
      } else {
        this.alertSvc.showAlert(3, '', 'No se pudo obtener el historial de límites');
      }
    } else {
      this.alertSvc.showAlert(3, '', 'No se pudo obtener el historial de límites');
    }
  }

  close() {
    this.goBack.emit(false);
  }

}
