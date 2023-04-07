import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVentasDetallesComponent } from './modal-ventas-detalles.component';

describe('ModalVentasDetallesComponent', () => {
  let component: ModalVentasDetallesComponent;
  let fixture: ComponentFixture<ModalVentasDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVentasDetallesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVentasDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
