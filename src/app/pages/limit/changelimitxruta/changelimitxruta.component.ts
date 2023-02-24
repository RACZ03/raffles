import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouteService } from 'src/app/@core/services/route.service';

@Component({
  selector: 'app-changelimitxruta',
  templateUrl: './changelimitxruta.component.html',
  styleUrls: ['./changelimitxruta.component.scss']
})
export class ChangelimitxrutaComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();

  formChangeLimiteXroute!: FormGroup;
  
    ///constructor
  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,

  ) { 
    
    }

 //OnInit
   ngOnInit(): void {
    this.formChangeLimiteXroute = this.initForms();
    
  }


  onSubmit(){
    //this.onClose.emit(true);
  }

  closeModal(band: boolean) {
    this.onClose.emit(true);
  }

  initForms(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      // email: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)] ],
    })
  }
}
