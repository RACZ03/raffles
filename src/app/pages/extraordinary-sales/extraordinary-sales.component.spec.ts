import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraordinarySalesComponent } from './extraordinary-sales.component';

describe('ExtraordinarySalesComponent', () => {
  let component: ExtraordinarySalesComponent;
  let fixture: ComponentFixture<ExtraordinarySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraordinarySalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraordinarySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
