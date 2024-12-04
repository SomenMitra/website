import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowYourStatusComponent } from './know-your-status.component';

describe('KnowYourStatusComponent', () => {
  let component: KnowYourStatusComponent;
  let fixture: ComponentFixture<KnowYourStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowYourStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowYourStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
