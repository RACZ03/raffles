import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarLimitnumxRutaComponent } from './cambiar-limitnumx-ruta.component';

describe('CambiarLimitnumxRutaComponent', () => {
  let component: CambiarLimitnumxRutaComponent;
  let fixture: ComponentFixture<CambiarLimitnumxRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarLimitnumxRutaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarLimitnumxRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
