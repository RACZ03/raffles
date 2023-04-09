import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListRutasComponent } from './modal-list-rutas.component';

describe('ModalListRutasComponent', () => {
  let component: ModalListRutasComponent;
  let fixture: ComponentFixture<ModalListRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalListRutasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
