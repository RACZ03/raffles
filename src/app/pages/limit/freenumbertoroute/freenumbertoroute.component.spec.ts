import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreenumbertorouteComponent } from './freenumbertoroute.component';

describe('FreenumbertorouteComponent', () => {
  let component: FreenumbertorouteComponent;
  let fixture: ComponentFixture<FreenumbertorouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreenumbertorouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreenumbertorouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
