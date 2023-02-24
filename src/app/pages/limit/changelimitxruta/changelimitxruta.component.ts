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
  @ViewChild('rutasInput') rutasInput!: ElementRef<HTMLInputElement>;

  addOnBlur = true;
  readonly separatorKeysCodesnumber = [ENTER, COMMA] as const;
  readonly separatorKeysCodesRutas = [ENTER, COMMA] as const;
  formChangeLimiteXroute!: FormGroup;
  Numeros: any[] = [];
  rutasCtrl = new FormControl('');
  filteredRutas: Observable<any[]>;
  rutas: any[] = [];
  allRutas: any[] = [];


    ///constructor
  constructor(
    private fb: FormBuilder,
    private routeSvc: RouteService,

  ) { 
    this.filteredRutas = this.rutasCtrl.valueChanges.pipe(
      startWith(null), 
      map((ruta :any | null )=> ruta ? this._filter(ruta) : this.allRutas.slice()));
    }

 //OnInit
   ngOnInit(): void {
    this.formChangeLimiteXroute = this.initForms();
    this.loadRutas();
  }

  async loadRutas() {
    let resp = await this.routeSvc.getRoute();
    //console.log(resp);
    let {status, data} = resp;
    if (status == 200) {
      console.log(data);
      this.allRutas = data;
    }
  }

  addNumber(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
// Add our number
    if (value) {this.Numeros.push({name: value});}
 // Clear the input value
    event.chipInput!.clear();}

  //remover number
  removeNumber(number: any): void {
    const index = this.Numeros.indexOf(number);
   if (index >= 0) {this.Numeros.splice(index, 1);}}

  //editar number
  editNumber(number: any, event: MatChipEditedEvent) {
    const value = event.value.trim();
    // Remove number if it no longer has a name
    if (!value) { this.removeNumber(number); return;}
    // Edit existing number
    const index = this.Numeros.indexOf(number);
    if (index >= 0) {this.Numeros[index].name = value;}}

    //addRutas
  addRutas(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
// Add our number
    if (value) {this.rutas.push(value);}
  // Clear the input value
    event.chipInput!.clear();}
  //remover rutas
  removeRutas(ruta: any): void {
    const index = this.rutas.indexOf(ruta);
    if (index >= 0) {this.rutas.splice(index, 1);}}

    selectedRutas(event: MatAutocompleteSelectedEvent): void {
      this.rutas.push(event.option.viewValue);
      this.rutasInput.nativeElement.value = '';
      this.rutasCtrl.setValue(null);
    }

    private _filter(value: any): any[] {
      const filterValue = value?.toLowerCase();
      return this.allRutas.filter(ruta => ruta.name.toLowerCase().indexOf(filterValue));
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
