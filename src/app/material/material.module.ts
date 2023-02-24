
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';


const MATERIALS_MODULE = [
  MatFormFieldModule,
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatIconModule,
  MatInputModule,

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MATERIALS_MODULE
  ],
  exports: [
    ...MATERIALS_MODULE
  ]
})
export class MaterialModule { }
