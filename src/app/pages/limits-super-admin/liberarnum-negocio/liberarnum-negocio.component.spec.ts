import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarnumNegocioComponent } from './liberarnum-negocio.component';

describe('LiberarnumNegocioComponent', () => {
  let component: LiberarnumNegocioComponent;
  let fixture: ComponentFixture<LiberarnumNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarnumNegocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiberarnumNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
