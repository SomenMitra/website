import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFeedbackComponent } from './apply-feedback.component';

describe('ApplyFeedbackComponent', () => {
  let component: ApplyFeedbackComponent;
  let fixture: ComponentFixture<ApplyFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
