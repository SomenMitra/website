import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedSchemeDetailsComponent } from './applied-scheme-details.component';

describe('AppliedSchemeDetailsComponent', () => {
  let component: AppliedSchemeDetailsComponent;
  let fixture: ComponentFixture<AppliedSchemeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedSchemeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedSchemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
