import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarnumRutasComponent } from './liberarnum-rutas.component';

describe('LiberarnumRutasComponent', () => {
  let component: LiberarnumRutasComponent;
  let fixture: ComponentFixture<LiberarnumRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarnumRutasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarnumRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
