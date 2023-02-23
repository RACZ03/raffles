import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-changelimitxruta',
  templateUrl: './changelimitxruta.component.html',
  styleUrls: ['./changelimitxruta.component.scss']
})
export class ChangelimitxrutaComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  formChangeLimiteXroute!: FormGroup;
  fruits: any[] = [{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  edit(fruit: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.formChangeLimiteXroute = this.initForms();
  }



  onSubmit(){
    this.onClose.emit(true);
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
