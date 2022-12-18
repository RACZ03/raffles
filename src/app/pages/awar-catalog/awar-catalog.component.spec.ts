import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwarCatalogComponent } from './awar-catalog.component';

describe('AwarCatalogComponent', () => {
  let component: AwarCatalogComponent;
  let fixture: ComponentFixture<AwarCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwarCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwarCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
