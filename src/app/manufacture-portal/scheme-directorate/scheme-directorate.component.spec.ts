import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDirectorateComponent } from './scheme-directorate.component';

describe('SchemeDirectorateComponent', () => {
  let component: SchemeDirectorateComponent;
  let fixture: ComponentFixture<SchemeDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDirectorateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
