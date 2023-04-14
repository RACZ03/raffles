import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsSuperAdminComponent } from './limits-super-admin.component';

describe('LimitsSuperAdminComponent', () => {
  let component: LimitsSuperAdminComponent;
  let fixture: ComponentFixture<LimitsSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitsSuperAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitsSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
