import { AfterViewInit, Component,HostListener,OnInit } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  public itemActive: boolean = true;
  public showActions: boolean = false;
  constructor() {
  }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.showActions = true;
    } else {
      this.showActions = false;
    }

  }

  ngAfterViewInit(): void {

  }

  onChange() {
    this.itemActive = !this.itemActive;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 992) {
      this.showActions = true;
    } else {
      this.showActions = false;
    }
  }
}
