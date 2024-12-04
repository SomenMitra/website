import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSeeddbtComponent } from './success-seeddbt.component';

describe('SuccessSeeddbtComponent', () => {
  let component: SuccessSeeddbtComponent;
  let fixture: ComponentFixture<SuccessSeeddbtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessSeeddbtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessSeeddbtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
