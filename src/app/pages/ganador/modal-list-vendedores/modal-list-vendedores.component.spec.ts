import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListVendedoresComponent } from './modal-list-vendedores.component';

describe('ModalListVendedoresComponent', () => {
  let component: ModalListVendedoresComponent;
  let fixture: ComponentFixture<ModalListVendedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListVendedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
