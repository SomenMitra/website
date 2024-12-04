import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceacknowledgeComponent } from './grievanceacknowledge.component';

describe('GrievanceacknowledgeComponent', () => {
  let component: GrievanceacknowledgeComponent;
  let fixture: ComponentFixture<GrievanceacknowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceacknowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceacknowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
