import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeforgotpasswordComponent } from './changeforgotpassword.component';

describe('ChangeforgotpasswordComponent', () => {
  let component: ChangeforgotpasswordComponent;
  let fixture: ComponentFixture<ChangeforgotpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeforgotpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeforgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
