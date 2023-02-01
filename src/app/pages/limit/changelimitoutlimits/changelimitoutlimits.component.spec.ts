import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelimitoutlimitsComponent } from './changelimitoutlimits.component';

describe('ChangelimitoutlimitsComponent', () => {
  let component: ChangelimitoutlimitsComponent;
  let fixture: ComponentFixture<ChangelimitoutlimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangelimitoutlimitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangelimitoutlimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
