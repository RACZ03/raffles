import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptListaModalComponent } from './rpt-lista-modal.component';

describe('RptListaModalComponent', () => {
  let component: RptListaModalComponent;
  let fixture: ComponentFixture<RptListaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptListaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptListaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
