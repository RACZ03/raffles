import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarLimitnumxVendedorComponent } from './cambiar-limitnumx-vendedor.component';

describe('CambiarLimitnumxVendedorComponent', () => {
  let component: CambiarLimitnumxVendedorComponent;
  let fixture: ComponentFixture<CambiarLimitnumxVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarLimitnumxVendedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarLimitnumxVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
