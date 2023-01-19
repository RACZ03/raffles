import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreenumbertosellerComponent } from './freenumbertoseller.component';

describe('FreenumbertosellerComponent', () => {
  let component: FreenumbertosellerComponent;
  let fixture: ComponentFixture<FreenumbertosellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreenumbertosellerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreenumbertosellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
