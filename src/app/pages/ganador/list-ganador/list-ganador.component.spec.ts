import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGanadorComponent } from './list-ganador.component';

describe('ListGanadorComponent', () => {
  let component: ListGanadorComponent;
  let fixture: ComponentFixture<ListGanadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGanadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGanadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
