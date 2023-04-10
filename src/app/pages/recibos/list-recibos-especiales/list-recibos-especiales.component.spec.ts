import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecibosEspecialesComponent } from './list-recibos-especiales.component';

describe('ListRecibosEspecialesComponent', () => {
  let component: ListRecibosEspecialesComponent;
  let fixture: ComponentFixture<ListRecibosEspecialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecibosEspecialesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRecibosEspecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
