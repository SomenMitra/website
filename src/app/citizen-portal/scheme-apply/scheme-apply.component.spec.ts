import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeApplyComponent } from './scheme-apply.component';

describe('SchemeApplyComponent', () => {
  let component: SchemeApplyComponent;
  let fixture: ComponentFixture<SchemeApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
