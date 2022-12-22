import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAwarCatalogComponent } from './add-awar-catalog.component';

describe('AddAwarCatalogComponent', () => {
  let component: AddAwarCatalogComponent;
  let fixture: ComponentFixture<AddAwarCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAwarCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAwarCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
