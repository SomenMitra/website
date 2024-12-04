import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDocumentApicolComponent } from './scheme-document-apicol.component';

describe('SchemeDocumentApicolComponent', () => {
  let component: SchemeDocumentApicolComponent;
  let fixture: ComponentFixture<SchemeDocumentApicolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDocumentApicolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeDocumentApicolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
