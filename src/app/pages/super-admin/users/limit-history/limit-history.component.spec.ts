import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitHistoryComponent } from './limit-history.component';

describe('LimitHistoryComponent', () => {
  let component: LimitHistoryComponent;
  let fixture: ComponentFixture<LimitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
