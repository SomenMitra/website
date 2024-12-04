import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemePreviewApicolComponent } from './scheme-preview-apicol.component';

describe('SchemePreviewApicolComponent', () => {
  let component: SchemePreviewApicolComponent;
  let fixture: ComponentFixture<SchemePreviewApicolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemePreviewApicolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemePreviewApicolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
