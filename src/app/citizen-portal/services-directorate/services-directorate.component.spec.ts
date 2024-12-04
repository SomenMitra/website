import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDirectorateComponent } from './services-directorate.component';

describe('ServicesDirectorateComponent', () => {
  let component: ServicesDirectorateComponent;
  let fixture: ComponentFixture<ServicesDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDirectorateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
