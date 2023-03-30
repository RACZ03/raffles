import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNegociosComponent } from './detalle-negocios.component';

describe('DetalleNegociosComponent', () => {
  let component: DetalleNegociosComponent;
  let fixture: ComponentFixture<DetalleNegociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleNegociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
