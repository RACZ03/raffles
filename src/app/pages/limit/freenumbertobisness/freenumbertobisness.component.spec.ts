import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreenumbertobisnessComponent } from './freenumbertobisness.component';

describe('FreenumbertobisnessComponent', () => {
  let component: FreenumbertobisnessComponent;
  let fixture: ComponentFixture<FreenumbertobisnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreenumbertobisnessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreenumbertobisnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
