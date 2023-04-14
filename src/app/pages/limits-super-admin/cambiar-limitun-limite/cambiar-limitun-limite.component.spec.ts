import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarLimitunLimiteComponent } from './cambiar-limitun-limite.component';

describe('CambiarLimitunLimiteComponent', () => {
  let component: CambiarLimitunLimiteComponent;
  let fixture: ComponentFixture<CambiarLimitunLimiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarLimitunLimiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarLimitunLimiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
