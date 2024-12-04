import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetifscCodeComponent } from './getifsc-code.component';

describe('GetifscCodeComponent', () => {
  let component: GetifscCodeComponent;
  let fixture: ComponentFixture<GetifscCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetifscCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetifscCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
