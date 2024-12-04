import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievancedashboardComponent } from './grievancedashboard.component';

describe('GrievancedashboardComponent', () => {
  let component: GrievancedashboardComponent;
  let fixture: ComponentFixture<GrievancedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievancedashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievancedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});