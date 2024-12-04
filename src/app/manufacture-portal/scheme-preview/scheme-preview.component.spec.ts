import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemePreviewComponent } from './scheme-preview.component';

describe('SchemePreviewComponent', () => {
  let component: SchemePreviewComponent;
  let fixture: ComponentFixture<SchemePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
