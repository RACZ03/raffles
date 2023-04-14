import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarLimitnumunVendedorComponent } from './cambiar-limitnumun-vendedor.component';

describe('CambiarLimitnumunVendedorComponent', () => {
  let component: CambiarLimitnumunVendedorComponent;
  let fixture: ComponentFixture<CambiarLimitnumunVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarLimitnumunVendedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarLimitnumunVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
