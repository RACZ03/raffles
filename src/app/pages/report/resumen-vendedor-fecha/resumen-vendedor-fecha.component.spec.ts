import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenVendedorFechaComponent } from './resumen-vendedor-fecha.component';

describe('ResumenVendedorFechaComponent', () => {
  let component: ResumenVendedorFechaComponent;
  let fixture: ComponentFixture<ResumenVendedorFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenVendedorFechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenVendedorFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
