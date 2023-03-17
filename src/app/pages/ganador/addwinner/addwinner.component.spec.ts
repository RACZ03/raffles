import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwinnerComponent } from './addwinner.component';

describe('AddwinnerComponent', () => {
  let component: AddwinnerComponent;
  let fixture: ComponentFixture<AddwinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddwinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddwinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
