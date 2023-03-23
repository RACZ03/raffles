import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/@core/utils/alert.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  constructor(
    private alertSvc: AlertService,
  ) { }

  ngOnInit(): void {
  }

  private device!: BluetoothDevice;

  discover() {
    navigator.bluetooth.requestDevice({
      filters: [{ name: 'PT-210' }],
    })
      .then(device => {
        console.log('Found device:', device);
        this.alertSvc.showAlert(1, 'Found device', device.name);
        this.device = device;
      })
      .catch(error => {
        this.alertSvc.showAlert(4, 'Error discovering device', error);
        console.error('Error discovering device:', error);
      });
  }

  print() {
    if (!this.device || !this.device.gatt) {
      // console.error('Device not connected');
      this.alertSvc.showAlert(3, 'Device not connected', 'Please connect to the printer first');
      return;
    }

    this.device.gatt.connect()
      .then((server: any) => server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb'))
      .then(service => service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb'))
      .then(characteristic => characteristic.writeValue(new Uint8Array([0x1b, 0x40, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21, 0x0a])))
      .then(() =>
        // console.log('Printed successfully');
        this.alertSvc.showAlert(1, 'Printed successfully', 'Please check the printer')
      )
      .catch(error => {
        console.error('Error printing:', error);
        this.alertSvc.showAlert(4, 'Error printing', error);
      });
  }


}
