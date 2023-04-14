import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarnumVendedorComponent } from './liberarnum-vendedor.component';

describe('LiberarnumVendedorComponent', () => {
  let component: LiberarnumVendedorComponent;
  let fixture: ComponentFixture<LiberarnumVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarnumVendedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarnumVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
