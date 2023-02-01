import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelimitxrutaComponent } from './changelimitxruta.component';

describe('ChangelimitxrutaComponent', () => {
  let component: ChangelimitxrutaComponent;
  let fixture: ComponentFixture<ChangelimitxrutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelimitxrutaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelimitxrutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
