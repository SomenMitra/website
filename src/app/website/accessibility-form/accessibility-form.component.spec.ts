import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityFormComponent } from './accessibility-form.component';

describe('AccessibilityFormComponent', () => {
  let component: AccessibilityFormComponent;
  let fixture: ComponentFixture<AccessibilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessibilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
