import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelimitxsellerComponent } from './changelimitxseller.component';

describe('ChangelimitxsellerComponent', () => {
  let component: ChangelimitxsellerComponent;
  let fixture: ComponentFixture<ChangelimitxsellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelimitxsellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelimitxsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
