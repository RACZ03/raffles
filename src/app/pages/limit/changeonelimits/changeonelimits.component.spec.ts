import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeonelimitsComponent } from './changeonelimits.component';

describe('ChangeonelimitsComponent', () => {
  let component: ChangeonelimitsComponent;
  let fixture: ComponentFixture<ChangeonelimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeonelimitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeonelimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
