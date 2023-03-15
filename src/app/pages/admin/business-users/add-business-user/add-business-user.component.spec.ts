import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessUserComponent } from './add-business-user.component';

describe('AddBusinessUserComponent', () => {
  let component: AddBusinessUserComponent;
  let fixture: ComponentFixture<AddBusinessUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBusinessUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBusinessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
