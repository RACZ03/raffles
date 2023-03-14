import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAwwardEspecialComponent } from './add-awward-especial.component';

describe('AddAwwardEspecialComponent', () => {
  let component: AddAwwardEspecialComponent;
  let fixture: ComponentFixture<AddAwwardEspecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAwwardEspecialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAwwardEspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
