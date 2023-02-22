import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-changelimitxruta',
  templateUrl: './changelimitxruta.component.html',
  styleUrls: ['./changelimitxruta.component.scss']
})
export class ChangelimitxrutaComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  
}
