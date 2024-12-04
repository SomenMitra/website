import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureDashboardComponent } from './manufacture-dashboard.component';

describe('ManufactureDashboardComponent', () => {
  let component: ManufactureDashboardComponent;
  let fixture: ComponentFixture<ManufactureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufactureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufactureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
