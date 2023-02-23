
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

const MATERIALS_MODULE = [
  MatFormFieldModule,
  MatChipsModule,
  MatIconModule,
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
