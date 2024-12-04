import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeApplyApicolComponent } from './scheme-apply-apicol.component';

describe('SchemeApplyApicolComponent', () => {
  let component: SchemeApplyApicolComponent;
  let fixture: ComponentFixture<SchemeApplyApicolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeApplyApicolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeApplyApicolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
