import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarLimitsinafectarlimitadosComponent } from './cambiar-limitsinafectarlimitados.component';

describe('CambiarLimitsinafectarlimitadosComponent', () => {
  let component: CambiarLimitsinafectarlimitadosComponent;
  let fixture: ComponentFixture<CambiarLimitsinafectarlimitadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarLimitsinafectarlimitadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarLimitsinafectarlimitadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
