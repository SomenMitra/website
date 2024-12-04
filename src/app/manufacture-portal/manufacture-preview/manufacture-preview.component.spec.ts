import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturePreviewComponent } from './manufacture-preview.component';

describe('ManufacturePreviewComponent', () => {
  let component: ManufacturePreviewComponent;
  let fixture: ComponentFixture<ManufacturePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
