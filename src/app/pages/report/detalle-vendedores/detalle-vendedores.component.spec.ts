import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVendedoresComponent } from './detalle-vendedores.component';

describe('DetalleVendedoresComponent', () => {
  let component: DetalleVendedoresComponent;
  let fixture: ComponentFixture<DetalleVendedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVendedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
