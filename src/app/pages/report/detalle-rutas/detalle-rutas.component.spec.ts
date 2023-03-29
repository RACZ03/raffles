import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRutasComponent } from './detalle-rutas.component';

describe('DetalleRutasComponent', () => {
  let component: DetalleRutasComponent;
  let fixture: ComponentFixture<DetalleRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleRutasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
