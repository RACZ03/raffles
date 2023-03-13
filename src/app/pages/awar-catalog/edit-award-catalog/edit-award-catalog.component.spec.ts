import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAwardCatalogComponent } from './edit-award-catalog.component';

describe('EditAwardCatalogComponent', () => {
  let component: EditAwardCatalogComponent;
  let fixture: ComponentFixture<EditAwardCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAwardCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAwardCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
