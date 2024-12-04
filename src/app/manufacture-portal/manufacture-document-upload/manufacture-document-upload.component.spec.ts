import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureDocumentUploadComponent } from './manufacture-document-upload.component';

describe('ManufactureDocumentUploadComponent', () => {
  let component: ManufactureDocumentUploadComponent;
  let fixture: ComponentFixture<ManufactureDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureDocumentUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
