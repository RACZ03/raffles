import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecibosComponent } from './list-recibos.component';

describe('ListRecibosComponent', () => {
  let component: ListRecibosComponent;
  let fixture: ComponentFixture<ListRecibosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecibosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
