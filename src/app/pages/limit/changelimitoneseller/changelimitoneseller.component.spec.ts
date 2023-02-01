import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelimitonesellerComponent } from './changelimitoneseller.component';

describe('ChangelimitonesellerComponent', () => {
  let component: ChangelimitonesellerComponent;
  let fixture: ComponentFixture<ChangelimitonesellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelimitonesellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelimitonesellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
