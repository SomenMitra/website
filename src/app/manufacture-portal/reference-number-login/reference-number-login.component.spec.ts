import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceNumberLoginComponent } from './reference-number-login.component';

describe('ReferenceNumberLoginComponent', () => {
  let component: ReferenceNumberLoginComponent;
  let fixture: ComponentFixture<ReferenceNumberLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceNumberLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceNumberLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
