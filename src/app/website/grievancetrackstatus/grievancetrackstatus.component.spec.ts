import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievancetrackstatusComponent } from './grievancetrackstatus.component';

describe('GrievancetrackstatusComponent', () => {
  let component: GrievancetrackstatusComponent;
  let fixture: ComponentFixture<GrievancetrackstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievancetrackstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievancetrackstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
