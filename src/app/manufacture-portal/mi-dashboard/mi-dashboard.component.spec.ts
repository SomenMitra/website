import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MIDashboardComponent } from './mi-dashboard.component';

describe('MIDashboardComponent', () => {
  let component: MIDashboardComponent;
  let fixture: ComponentFixture<MIDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MIDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MIDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
