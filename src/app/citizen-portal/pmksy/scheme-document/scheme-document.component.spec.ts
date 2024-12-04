import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDocumentComponent } from './scheme-document.component';

describe('SchemeDocumentComponent', () => {
  let component: SchemeDocumentComponent;
  let fixture: ComponentFixture<SchemeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
