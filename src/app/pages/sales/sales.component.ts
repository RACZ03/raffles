import { AfterViewInit, Component,HostListener,OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
// import {  } from 'ngx-slick-carousel';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild('slickModal', { static: true }) slickModal!: SlickCarouselComponent;

  public slideConfig: any = {
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1
  };

  constructor() {
  }

  ngOnInit(): void {
    if (window.innerWidth < 992) {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 2;
    }

  }

  ngAfterViewInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 992) {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 2;
    }
    this.slickModal.unslick();
    this.slickModal.initSlick();
  }
}
