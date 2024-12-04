import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenCommonLoginComponent } from './citizen-common-login.component';

describe('CitizenCommonLoginComponent', () => {
  let component: CitizenCommonLoginComponent;
  let fixture: ComponentFixture<CitizenCommonLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenCommonLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenCommonLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
