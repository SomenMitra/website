import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeTabComponent } from './scheme-tab.component';

describe('SchemeTabComponent', () => {
  let component: SchemeTabComponent;
  let fixture: ComponentFixture<SchemeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
