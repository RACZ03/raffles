import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleEspecialComponent } from './modal-detalle-especial.component';

describe('ModalDetalleEspecialComponent', () => {
  let component: ModalDetalleEspecialComponent;
  let fixture: ComponentFixture<ModalDetalleEspecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleEspecialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleEspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
